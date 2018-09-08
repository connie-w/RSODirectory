# Imports the Google Cloud client library
from google.cloud import datastore

# explicitlly set file to use as service account credentials
# assumes that the service account json is stored under the same directory
# make sure you don't commit the private key for this .json to the github!!
datastore_client = datastore.Client.from_service_account_json(
        'udev-rsodirectory-53eb9f38363b.json')

# Instantiates a client
# if you sucessfully set GOOGLE_APPLICATION_CREDENTIALS, you can use this line
# of code to initialize the datastore client instead
#datastore_client = datastore.Client()

# The kind for the new entity, this is like the "type"
kind = 'RSO'
# The name/ID for the new entity
name = 'sampletask1'
# The Cloud Datastore key for the new entity
task_key = datastore_client.key(kind, name)

# Prepares the new entity
task = datastore.Entity(key=task_key)
task['description'] = 'Test 08182018'

# Saves the entity
datastore_client.put(task)

print('Saved {}: {}'.format(task.key.name, task['description']))
