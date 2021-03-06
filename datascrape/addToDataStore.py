# Imports the Google Cloud client library
from google.cloud import datastore
# Imports array of all RSOs 
from convert import all_clubs

# explicitlly set file to use as service account credentials
# assumes that the service account json is stored under the same directory
# make sure you don't commit the private key for this .json to the github!!
datastore_client = datastore.Client.from_service_account_json(
        'udev-rsodirectory-53eb9f38363b.json')

# Instantiates a client
# if you sucessfully set GOOGLE_APPLICATION_CREDENTIALS, you can use this line
# of code to initialize the datastore client instead
#datastore_client = datastore.Client()

# The kind for the new entity, this is like the "type", or is equivilant to
# the table in SQL
kind = 'RSO'

# only adding a subset of all clubs for testing purposes
for i in range(2): #replace with len(all_clubs) when not testing
    curr = all_clubs[i] 
    name = curr[0]
    gid = curr[1]
    task_key = datastore_client.key(kind, gid)
    task = datastore.Entity(key=task_key)
    task['name'] = name
    task['description'] = curr[2]
    task['email'] = curr[3]
    task['category'] = curr[4]
    task['logo'] = curr[5]
    task['fb'] = curr[6]
    datastore_client.put(task)
    print('saved: ' + name)

#print('Saved {}: {}'.format(task.key.name, task['description']))
