import * as Keychain from 'react-native-keychain';
import Realm from "realm";

// KEYCHAIN TEST
export const testKeychain = async () => {
  console.log("------------------- TESTING KEYCHAIN START ------------------")
  try {
    
    const username = 'zuck';
    const password = 'poniesRgr8';
  
    // Store the credentialsc
    console.log('Setting credential')
    await Keychain.setGenericPassword(username, password);
  
    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
    console.log("Deleting credential")
    await Keychain.resetGenericPassword({});
    console.log("Deleted credential")
  } catch (error) {
    console.log(error)
  }
  console.log("------------------- TESTING KEYCHAIN END ------------------")
}

// REALM SDK TEST

const TaskSchema = {
  name: "Task",
  properties: {
    _id: "int",
    name: "string",
    status: "string?",
  },
  primaryKey: "_id",
};

export const testREALM = async () => {
  console.log('------------------- TESTING REALM ------------------')
  try {
    const realm = await Realm.open({
      path: "myrealm",
      schema: [TaskSchema],
    });
    
    // Add a couple of Tasks in a single, atomic transaction
    let task1, task2;
    realm.write(() => {
      realm.deleteAll()
      task1 = realm.create("Task", {
        _id: 1,
        name: "go grocery shopping",
        status: "Open",
      });
      task2 = realm.create("Task", {
        _id: 2,
        name: "go exercise",
        status: "Open",
      });
      console.log(`created two tasks: ${task1.name} & ${task2.name}`);
    });
    // use task1 and task2
    // query realm for all instances of the "Task" type.
    const tasks = realm.objects("Task");
    console.log(`The lists of tasks are: ${tasks.map((task: any) => task.name)}`);
    // filter for all tasks with a status of "Open"
    const openTasks = tasks.filtered("status = 'Open'");
    console.log(
      `The lists of open tasks are: ${openTasks.map(
        (openTask: any) => openTask.name
      )}`
    );
    // Sort tasks by name in ascending order
    const tasksByName = tasks.sorted("name");
    console.log(
      `The lists of tasks in alphabetical order are: ${tasksByName.map(
        (taskByName: any) => taskByName.name
      )}`
    );
    // Define the collection notification listener
    function listener(tasks, changes) {
      // Update UI in response to deleted objects
      changes.deletions.forEach((index) => {
        // Deleted objects cannot be accessed directly,
        // but we can update a UI list, etc. knowing the index.
        console.log(`A task was deleted at the ${index} index`);
      });
      // Update UI in response to modified objects
      // `newModifications` contains object indexes from after they were modified
      changes.newModifications.forEach((index) => {
        const modifiedTask = tasks[index];
        console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
        // ...
      });
    }
    // Observe collection notifications.
    tasks.addListener(listener);
    realm.write(() => {
      task1.status = "InProgress";
    });
    realm.write(() => {
      // Delete the task from the realm.
      realm.delete(task1);
      // Discard the reference.
      task1 = null;
    });
    // Remember to close the realm
    realm.close();
    console.log('Closing Realm')
  } catch (error) {
    console.log(error) 
  }
  console.log('------------------- TESTING REALM END ------------------')
}