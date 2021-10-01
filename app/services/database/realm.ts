import { KitDialogRef } from './../../components/kit-dialog/kit-dialog';
import { DecodedQr, decodeFromImage, decodeFromString } from './../qr/greenpass';
import Realm, { ObjectSchema } from 'realm';
import { ForwardedRef, useEffect, useState } from "react"
import dayjs from 'dayjs'
import { delay } from '../../utils/delay';
import { translate } from '../../i18n';

export const PassSchema: ObjectSchema = {
  name: "Pass",
  primaryKey: 'added',
  properties: {
    added: {
      type: 'string',
      optional: false,
      indexed: true
    },
    type: {
      type: 'string',
      optional: false,
      indexed: true
    },
    qr: {
      type: 'string',
      optional: false,
    },
    name: {
      type: 'string',
      optional: true,
      default: null
    },
    surname: {
      type: 'string',
      optional: true,
      default: null
    },
    lastVaccination: {
      type: 'string',
      optional: true,
      default: null
    },
    expires: {
      type: 'string',
      optional: true,
      default: null
    }
  }
}

export interface QRPass {
  added: string,
  type: string,
  qr: string,
  name?: string,
  surname?: string,
  lastVaccination?: string,
  expires?: string
}

export async function getRealmDatabase() {
  if (__DEV__) {
    Realm.deleteFile({
      path: "db.realm"
    })
  }
  return await Realm.open({
    path: "db.realm",
    schema: [PassSchema],
  });
}


export function useGetPassListQuery() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [query, setQuery] = useState(() => () => null)
  
  useEffect(() => {
    const setupQuery = async () => {
      const realm = await getRealmDatabase();
      const queryRes = () => realm.objects("Pass")
      setQuery(() => queryRes)
    }
    setupQuery()
  }, [])

  return query
}

/**
 * Return a realm query result as react state
 */
export function useRealmResultsHook(query, args = []) {
  const queryValidData = args ? query(args) : query()
  const [data, setData] = useState(queryValidData !== null ? [...queryValidData] : [])

  useEffect(() => {
    function handleChange(newData) {
      console.log("New data", newData)
      setData([...newData])                   // different object and execute a re-render
    }

    const dataQuery = args ? query(...args) : query()
    if (dataQuery !== null) {
      console.log("Adding listener for query")
      dataQuery?.addListener(handleChange)

      return () => {
        console.log("Removing handle listening for query")
        dataQuery.removeAllListeners()
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }
  }, [query, ...args])

  return data           // this hook will return only the data from realm
}


export async function addPass(passData: DecodedQr): Promise<QRPass | null> {
  try {
    console.log(`ADDING PASS ${passData.qr} TO DATABASE`)
    const realm = await getRealmDatabase();
    let pass: QRPass = null
    realm.write(() => {
      pass = realm.create("Pass", {
        added: dayjs().format(),
        qr: passData.qr,
        name: passData.data.name,
        surname: passData.data.surname,
        lastVaccination: passData.data.lastVaccination,
        type: passData.data.type,
        expires: ''
      })
    })
    return pass
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function addPassfromSource(data: { fromUri?: string, fromString?: string }, dialog: React.MutableRefObject<KitDialogRef>): Promise< QRPass | null> {
  if (!data || data == null || data === undefined)
    return null
  let pass = null
  try {
    if(data.fromUri)
      pass = await decodeFromImage(data.fromUri)
    else
      pass = await decodeFromString(data.fromString)
    await delay(1000)
  } catch (error) {
    console.error(error)
    dialog.current.show({
      title: translate('common.error'),
      description: translate('addPass.genericError'),
      status: 'danger',
      onOk: () => dialog.current.dismiss()
    })
  }
  console.log(JSON.stringify(pass, null, 2))
  if (pass) {
    pass = await addPass(pass)
  } else {
    dialog.current.show({
      title: translate('common.error'),
      description: translate('addPass.emptyScan'),
      status: 'danger',
      onOk: () => dialog.current.dismiss()
    })
  }
  return pass
}