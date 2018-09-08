import csv

all_clubs = []
#indiviudal club info is stored in a python list with each club attached to all_clubs of type list
with open("rso-data.csv",'r') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        name = row.pop(1)
        gid = row.pop(1)
        row.pop(1)
        description = row.pop(1)
        email = row.pop(1)
        category = row.pop(1) 
        logo = row.pop(1)
        fb = row.pop(1)
        
        club = [name,gid,description,email,category,logo,fb]
        all_clubs.append(club)
        
# print(len(all_clubs))
