const Realm = require("realm");
const announcementSchema = require("./announcementModel");

if (process.env.NODE_ENV !== "prod") {
    require('dotenv').config();
  }
const realm_id = process.env.realm_id; 

const app = new Realm.App({ id: realm_id });

async function handleLogin() {
    // Create a Credentials object to identify the user.
    // Anonymous credentials don't have any identifying information, but other
    // authentication providers accept additional data, like a user's email and
    // password.
    const credentials = Realm.Credentials.anonymous();
    // You can log in with any set of credentials using `app.logIn()`
    const user = await app.logIn(credentials);
    console.log(`Logged in with the user id: ${user.id}`);
};
handleLogin().catch(err => {
    console.error("Failed to log in:", err)
});


async function run() {
    await app.logIn(new Realm.Credentials.anonymous());
    // When you open a synced realm, the SDK automatically
    // creates the realm on the device (if it didn't exist already) and
    // syncs pending remote changes as well as any unsynced changes made
    // to the realm on the device.
    const realm = await Realm.open({
        schema: [announcementSchema],
        sync: {
            user: app.currentUser,
            flexible: true,
            initialSubscriptions: {
                update: (subs, realm) => {
                  subs.add(
                    realm.objects("announcement").filtered('clientId == "nyv63j0a5wjct"')
                  );
                },
              },
        },
    });
 
    
    // Query realm for all instances of the "announcements" type.
    const announcements = realm.objects("announcement");
    
    // Subscribe to announements (adding further filters to initialSubscriptions in the realm config)
    const rejected = announcements.filtered(
        'taskStatus == "rejected"'
    )
    const cancelled = announcements.filtered(
        'taskStatus == "cancelled"'
    )
    await realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(rejected, {
            name: "rejected",
        });
        mutableSubs.add(cancelled, {
            name: "cancelled",
        });
    });
    
    console.log("SUBS", realm.subscriptions); // log the subscription state
   
    // Observe collection notifications.
    announcements.addListener(listener);

}
run().catch(err => {
    console.error("Failed to open realm:", err)
});



// Define the collection notification listener
function listener(announcements, changes) {
    
    console.log("CHANGE", changes)

    // Update UI in response to deleted objects
    changes.deletions.forEach((index) => {
        // Deleted objects cannot be accessed directly,
        // but we can update a UI list, etc. knowing the index.
    });

    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => {
        let insertedTasks = announcements[index];
        // ...
    });

    // Update UI in response to modified objects
    // `oldModifications` contains object indexes from before they were modified
    changes.oldModifications.forEach((index) => {
        let modifiedTask = announcements[index];
        // ...
    });

    // Update UI in response to modified objects
    // `newModifications` contains object indexes from after they were modified
    changes.newModifications.forEach((index) => {
        let modifiedTask = announcements[index];
        // ...
    });
}

