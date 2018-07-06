class Rso():
    # defines data fields for a single RSO
    # more fields to be added as needed

    # initializes rso with given name and desc
    def __init__(self, name, desc):
        self.name = name
        self.description = desc

    # toString function for rso
    def __str__(self):
     return "Name: " + self.name + "\t Description: " + self.description

rsoList = []

# Creates an array of 10 RSOs with names and descriptions
for i in range(10):
    curr = Rso("RSO" + str(i), "This is RSO " + str(i))
    rsoList.append(curr)
        
