import { Collection } from 'realm';
import { useEffect, useState } from "react"


export const TaskSchema = {
  name: "Task",
  properties: {
    _id: "int",
    name: "string",
    status: "string?",
  },
  primaryKey: "_id",
};


export function useGetPassListQuery() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [query, setQuery] = useState(() => () => null)
  
  useEffect(() => {
    const setupQuery = async () => {
      Realm.deleteFile({
        path: "myrealm"
      })
      const realm = await Realm.open({
        path: "myrealm",
        schema: [TaskSchema],
      });
      const queryRes = () => realm.objects("Task")
      console.log("QUERY RES:",queryRes)
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
      console.log("NEW DATA INCOMING")
      setData([...newData])                   // different object and execute a re-render
    }

    const dataQuery = args ? query(...args) : query()
    if (dataQuery !== null) {
      console.log("DATAQUEY VALID SETIING UP HANDLE CHANGE")
      dataQuery?.addListener(handleChange)

      return () => {
        dataQuery.removeAllListeners()
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }
  }, [query, ...args])

  return data           // this hook will return only the data from realm
}