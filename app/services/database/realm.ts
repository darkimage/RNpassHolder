import { DecodedQr } from './../qr/greenpass';
import Realm, { ObjectSchema } from 'realm';
import { useEffect, useState } from "react"
import dayjs from 'dayjs'

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


export async function addPass(passData: DecodedQr) {
  try {
    console.log(`ADDING PASS ${passData.qr} TO DATABASE`)
    const realm = await getRealmDatabase();
    let pass = null
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