// change the name of the localhost if needed. This would create a DB called bi91zm-CET341-A2. The name can be changed, it shouldn't affect anything.
db = connect ('mongodb://localhost/bi91zm-CET341-A2');


// Simple function to drop the collections if they exist
const collections= ["users","products","categories","orders"];
collections.forEach(collectionName => {
  if (db.getCollectionNames().includes(collectionName)) {
    db[collectionName].drop();
    print('Dropped existing collection:', collectionName)
  } else {
    print('Collection', collectionName, 'did not exist');
  }
});


/*
Each collection has an index command below it for its relevant id. The default _id is not used in the current aggregation pipeline as the data was generated for an SQL database but in a production environment, any future document after the creation of this database would use the mongodb's auto-generated _id to relate to other collections.
The collections follow this order:
- Users           (Starts at line 33 at the time of subsmission)
- Products        (Starts at line 804 at the time of subsmission)
- Categories      (Starts at line 1827 at the time of subsmission)
- Orders          (Starts at line 1975 at the time of subsmission)
*/


/*
=========================================================USERS============================================================
=========================================================USERS============================================================
=========================================================USERS============================================================
*/

db.createCollection("users", {
  validator: {
    $jsonSchema: {
    bsonType: "object",
    required: ["username","email","password_hash","last_name","is_active",],
    properties: {
      username: {
        bsonType: "string",
        maxLength: 20,
        description: "Username is required and must be a unique string"
      },
      email: {
        bsonType: "string",
        maxLength: 50,
        description: "Email is required and must be a unique string"
      },
      password_hash: {
        bsonType: "string",
        maxLength: 50,
        description: "Password is required and must be a hashed string"
      },
      forenames: {
        bsonType: "string",
        maxLength: 25,
        description: "Forenames should be string value"
      },
      last_name: {
        bsonType: "string",
        maxLength: 25,
        description: "Last name is required and must be a string"
      },
      is_active: {
        bsonType: "bool",
        description: "Account status must be a boolean"
      }
    }
  }
  }
});

db.users.createIndex( { user_id: 1, username: 1, email: 1 }, { unique: true });

db.users.insertMany([
  {
    "user_id": 1,
    "username": "john_smith",
    "email": "smith.j@domain.com",
    "password_hash": "a1b2c3d4e5f6g7h8i9j0",
    "forenames": "John",
    "last_name": "Smith",
    "last_login": ISODate("2025-02-15T10:30:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "John Smith",
        "street": "10 Downing Street",
        "city": "London",
        "state": "England",
        "zip_code": "SW1A 2AA",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "John Smith",
        "street": "22 Park Lane",
        "city": "London",
        "state": "England",
        "zip_code": "SW1A 2AA",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-06-06T09:15:22Z"),
    "last_modified": ISODate("2024-06-09T17:13:55Z")
  },
  {
    "user_id": 2,
    "username": "sarah_jones",
    "email": "jones.s@domain.com",
    "password_hash": "b2c3d4e5f6g7h8i9j0k1",
    "forenames": "Sarah",
    "last_name": "Jones",
    "last_login": ISODate("2025-03-20T14:45:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Sarah Jones",
        "street": "35 Oxford Street",
        "city": "Manchester",
        "state": "England",
        "zip_code": "M1 1AA",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-06-15T11:20:33Z"),
    "last_modified": ISODate("2024-07-05T11:20:33Z")
  },
  {
    "user_id": 3,
    "username": "david_wilson",
    "email": "wilson.d@domain.com",
    "password_hash": "c3d4e5f6g7h8i9j0k1l2",
    "forenames": "David",
    "last_name": "Wilson",
    "last_login": ISODate("2024-12-10T16:20:00Z"),
    "is_active": false,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "David Wilson",
        "street": "7 Baker Street",
        "city": "London",
        "state": "England",
        "zip_code": "NW1 6XE",
        "country": "UK",
        "active": false
      }
    ],
    "created_at": ISODate("2024-07-03T14:05:44Z"),
    "last_modified": ISODate("2024-12-10T18:05:44Z")
  },
  {
    "user_id": 4,
    "username": "emma_brown",
    "email": "brown.e@domain.com",
    "password_hash": "d4e5f6g7h8i9j0k1l2m3",
    "forenames": "Emma",
    "last_name": "Brown",
    "last_login": ISODate("2025-04-25T09:10:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Emma Brown",
        "street": "15 Regent Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1B 5AH",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Emma Brown",
        "street": "22 Piccadilly",
        "city": "London",
        "state": "England",
        "zip_code": "W1J 0BH",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 3,
        "recipient_name": "Robert Brown",
        "street": "8 Bond Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1S 1YF",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-08-01T10:30:55Z"),
    "last_modified": ISODate("2024-11-15T12:40:00Z")
  },
  {
    "user_id": 5,
    "username": "michael_taylor",
    "email": "taylor.m@domain.com",
    "password_hash": "e5f6g7h8i9j0k1l2m3n4",
    "forenames": "Michael",
    "last_name": "Taylor",
    "last_login": ISODate("2025-03-24T18:30:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Michael Taylor",
        "street": "3 Abbey Road",
        "city": "London",
        "state": "England",
        "zip_code": "NW8 9AY",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 2,
        "recipient_name": "Lisa Taylor",
        "street": "12 Camden High Street",
        "city": "London",
        "state": "England",
        "zip_code": "NW1 0JH",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-09-02T16:45:11Z"),
    "last_modified": ISODate("2024-12-20T09:15:00Z")
  },
  {
    "user_id": 6,
    "username": "olivia_williams",
    "email": "williams.o@domain.com",
    "password_hash": "f6g7h8i9j0k1l2m3n4o5",
    "forenames": "Olivia",
    "last_name": "Williams",
    "last_login": ISODate("2025-05-16T11:20:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Olivia Williams",
        "street": "25 Knightsbridge",
        "city": "London",
        "state": "England",
        "zip_code": "SW1X 7LY",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Olivia Williams",
        "street": "40 Sloane Street",
        "city": "London",
        "state": "England",
        "zip_code": "SW1X 9LT",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-10-02T13:25:33Z"),
    "last_modified": ISODate("2025-01-20T14:50:00Z")
  },
  {
    "user_id": 7,
    "username": "james_johnson",
    "email": "johnson.j@domain.com",
    "password_hash": "g7h8i9j0k1l2m3n4o5p6",
    "forenames": "James",
    "last_name": "Johnson",
    "last_login": ISODate("2025-05-17T14:30:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "James Johnson",
        "street": "17 Fleet Street",
        "city": "London",
        "state": "England",
        "zip_code": "EC4Y 1AA",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-11-20T15:40:22Z"),
    "last_modified": ISODate("2024-11-20T15:40:22Z")
  },
  {
    "user_id": 8,
    "username": "sophia_davis",
    "email": "davis.s@domain.com",
    "password_hash": "h8i9j0k1l2m3n4o5p6q7",
    "forenames": "Sophia",
    "last_name": "Davis",
    "last_login": ISODate("2025-05-14T10:15:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Sophia Davis",
        "street": "9 Covent Garden",
        "city": "London",
        "state": "England",
        "zip_code": "WC2E 8RA",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Sophia Davis",
        "street": "21 Leicester Square",
        "city": "London",
        "state": "England",
        "zip_code": "WC2H 7LE",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 3,
        "recipient_name": "William Davis",
        "street": "33 Shaftesbury Avenue",
        "city": "London",
        "state": "England",
        "zip_code": "W1D 7EH",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2024-12-15T12:55:44Z"),
    "last_modified": ISODate("2025-01-10T11:30:00Z")
  },
  {
    "user_id": 9,
    "username": "robert_miller",
    "email": "miller.r@domain.com",
    "password_hash": "i9j0k1l2m3n4o5p6q7r8",
    "forenames": "Robert",
    "last_name": "Miller",
    "last_login": ISODate("2025-05-05T13:45:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Robert Miller",
        "street": "5 Carnaby Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1F 9PB",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Robert Miller",
        "street": "18 Regent Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1B 5AH",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-01-08T10:10:11Z"),
    "last_modified": ISODate("2025-02-01T16:20:00Z")
  },
  {
    "user_id": 10,
    "username": "amelia_wilson",
    "email": "wilson.a@domain.com",
    "password_hash": "j0k1l2m3n4o5p6q7r8s9",
    "forenames": "Amelia",
    "last_name": "Wilson",
    "last_login": ISODate("2025-05-18T16:50:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Amelia Wilson",
        "street": "14 Oxford Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1D 1AS",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-01-20T14:30:33Z"),
    "last_modified": ISODate("2025-01-20T14:30:33Z")
  },
  {
    "user_id": 11,
    "username": "william_moore",
    "email": "moore.w@domain.com",
    "password_hash": "k1l2m3n4o5p6q7r8s9t0",
    "forenames": "William",
    "last_name": "Moore",
    "last_login": ISODate("2025-05-15T09:30:00Z"),
    "is_active": true,
    "default_address_id": 3,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "William Moore",
        "street": "27 Baker Street",
        "city": "London",
        "state": "England",
        "zip_code": "NW1 6XE",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Charlotte Moore",
        "street": "36 Marylebone High Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1U 4QE",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 3,
        "recipient_name": "William Moore",
        "street": "8 Paddington Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1U 5QH",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 4,
        "recipient_name": "George Moore",
        "street": "15 Harley Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1G 9QQ",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-02-10T11:45:55Z"),
    "last_modified": ISODate("2025-02-26T10:15:00Z")
  },
  {
    "user_id": 12,
    "username": "isabella_taylor",
    "email": "taylor.i@domain.com",
    "password_hash": "l2m3n4o5p6q7r8s9t0u1",
    "forenames": "Isabella",
    "last_name": "Taylor",
    "last_login": ISODate("2025-03-15T11:20:00Z"),
    "is_active": false,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Isabella Taylor",
        "street": "22 Jermyn Street",
        "city": "London",
        "state": "England",
        "zip_code": "SW1Y 6HL",
        "country": "UK",
        "active": false
      }
    ],
    "created_at": ISODate("2025-02-25T16:20:22Z"),
    "last_modified": ISODate("2025-03-15T16:20:22Z")
  },
  {
    "user_id": 13,
    "username": "thomas_anderson",
    "email": "anderson.t@domain.com",
    "password_hash": "m3n4o5p6q7r8s9t0u1v2",
    "forenames": "Thomas",
    "last_name": "Anderson",
    "last_login": ISODate("2025-05-18T14:10:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Thomas Anderson",
        "street": "9 The Strand",
        "city": "London",
        "state": "England",
        "zip_code": "WC2N 5HR",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 2,
        "recipient_name": "Sophie Anderson",
        "street": "31 Trafalgar Square",
        "city": "London",
        "state": "England",
        "zip_code": "WC2N 5DN",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-03-05T09:35:33Z"),
    "last_modified": ISODate("2025-03-18T15:45:00Z")
  },
  {
    "user_id": 14,
    "username": "charlotte_thomas",
    "email": "thomas.c@domain.com",
    "password_hash": "n4o5p6q7r8s9t0u1v2w3",
    "forenames": "Charlotte",
    "last_name": "Thomas",
    "last_login": ISODate("2025-05-16T10:45:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Charlotte Thomas",
        "street": "17 Pall Mall",
        "city": "London",
        "state": "England",
        "zip_code": "SW1Y 5LA",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-03-15T13:50:44Z"),
    "last_modified": ISODate("2025-03-15T13:50:44Z")
  },
  {
    "user_id": 15,
    "username": "daniel_white",
    "email": "white.d@domain.com",
    "password_hash": "o5p6q7r8s9t0u1v2w3x4",
    "forenames": "Daniel",
    "last_name": "White",
    "last_login": ISODate("2025-05-17T15:30:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Daniel White",
        "street": "4 St James's Square",
        "city": "London",
        "state": "England",
        "zip_code": "SW1Y 4JU",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Daniel White",
        "street": "12 Haymarket",
        "city": "London",
        "state": "England",
        "zip_code": "SW1Y 4DQ",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 3,
        "recipient_name": "Lucy White",
        "street": "25 Cockspur Street",
        "city": "London",
        "state": "England",
        "zip_code": "SW1Y 5BN",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-04-01T08:25:55Z"),
    "last_modified": ISODate("2025-04-10T14:20:00Z")
  },
  {
    "user_id": 16,
    "username": "matthew_martin",
    "email": "martin.m@domain.com",
    "password_hash": "p6q7r8s9t0u1v2w3x4y5",
    "forenames": "Matthew",
    "last_name": "Martin",
    "last_login": ISODate("2025-05-14T09:15:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Matthew Martin",
        "street": "8 Berkeley Square",
        "city": "London",
        "state": "England",
        "zip_code": "W1J 6DA",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Matthew Martin",
        "street": "15 Grosvenor Square",
        "city": "London",
        "state": "England",
        "zip_code": "W1K 6JP",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-04-10T11:30:11Z"),
    "last_modified": ISODate("2025-04-20T10:45:00Z")
  },
  {
    "user_id": 17,
    "username": "emily_thompson",
    "email": "thompson.e@domain.com",
    "password_hash": "q7r8s9t0u1v2w3x4y5z6",
    "forenames": "Emily",
    "last_name": "Thompson",
    "last_login": ISODate("2025-05-15T11:50:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Emily Thompson",
        "street": "22 Mount Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1K 2RD",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-04-18T14:40:22Z"),
    "last_modified": ISODate("2025-04-18T14:40:22Z")
  },
  {
    "user_id": 18,
    "username": "andrew_robinson",
    "email": "robinson.a@domain.com",
    "password_hash": "r8s9t0u1v2w3x4y5z6a7",
    "forenames": "Andrew",
    "last_name": "Robinson",
    "last_login": ISODate("2025-05-18T14:20:00Z"),
    "is_active": true,
    "default_address_id": 2,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Andrew Robinson",
        "street": "7 Curzon Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1J 5HG",
        "country": "UK",
        "active": false
      },
      {
        "address_id": 2,
        "recipient_name": "Andrew Robinson",
        "street": "14 Park Lane",
        "city": "London",
        "state": "England",
        "zip_code": "W1K 7AN",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 3,
        "recipient_name": "Grace Robinson",
        "street": "21 South Audley Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1K 2PW",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-04-25T16:55:33Z"),
    "last_modified": ISODate("2025-05-01T13:10:00Z")
  },
  {
    "user_id": 19,
    "username": "sophie_clark",
    "email": "clark.s@domain.com",
    "password_hash": "s9t0u1v2w3x4y5z6a7b8",
    "forenames": "Sophie",
    "last_name": "Clark",
    "last_login": ISODate("2025-05-17T10:10:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Sophie Clark",
        "street": "5 Bruton Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1J 6PT",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-05-01T10:20:44Z"),
    "last_modified": ISODate("2025-05-01T10:20:44Z")
  },
  {
    "user_id": 20,
    "username": "joseph_rodriguez",
    "email": "rodriguez.j@domain.com",
    "password_hash": "t0u1v2w3x4y5z6a7b8c9",
    "forenames": "Joseph",
    "last_name": "Rodriguez",
    "last_login": ISODate("2025-05-20T16:40:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Joseph Rodriguez",
        "street": "12 Dover Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1S 4LQ",
        "country": "UK",
        "active": true
      },
      {
        "address_id": 2,
        "recipient_name": "Mia Rodriguez",
        "street": "18 Grafton Street",
        "city": "London",
        "state": "England",
        "zip_code": "W1S 4ER",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-05-05T13:15:55Z"),
    "last_modified": ISODate("2025-05-08T09:30:00Z")
  },
  {
    "user_id": 21,
    "username": "jef_keller",
    "email": "keller.j@domain.com",
    "password_hash": "t0u1v2w3x4y5z6a7b8c9",
    "forenames": "Jef",
    "last_name": "Keller",
    "last_login": ISODate("2025-05-20T16:40:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": [
      {
        "address_id": 1,
        "recipient_name": "Jef Keller",
        "street": "31 Lantington Ave",
        "city": "London",
        "state": "England",
        "zip_code": "W1S 8NE",
        "country": "UK",
        "active": true
      }
    ],
    "created_at": ISODate("2025-05-20T13:15:55Z"),
    "last_modified": ISODate("2025-05-20T09:30:00Z")
  },
  {
    "user_id": 22,
    "username": "mary_potter",
    "email": "potter.m@domain.com",
    "password_hash": "t0u1v2w3x4y5z6a7b8c9",
    "forenames": "Mary",
    "last_name": "Potter",
    "last_login": ISODate("2025-05-23T16:40:00Z"),
    "is_active": true,
    "default_address_id": 1,
    "addresses": null,
    "created_at": ISODate("2025-05-22T13:15:55Z"),
    "last_modified": ISODate("2025-05-23T09:30:00Z")
  }
]);


/*
=========================================================PRODUCTS============================================================
=========================================================PRODUCTS============================================================
=========================================================PRODUCTS============================================================
*/

db.createCollection("products", {
  validator: {
    $jsonSchema: {
    bsonType: "object",
    required: ["product_type","name","base_price","variants"],
    properties: {
      product_type: {
        bsonType: "string",
        maxLength: 25,
        description: "The product type is required"
      },
      name: {
        bsonType: "string",
        maxLength: 100,
        description: "Product name is required and must be a unique string"
      },
      description: {
        bsonType: "string",
        description: "Description should be a string"
      },
      base_price: {
        bsonType: "double",
        description: "base_price is required and should be a decimal e.g. 19.99"
      },
      variants: {
        bsonType: "array",
        description: "Atleast one variant must be added to the product"
      }
    }
  }
  }
});

db.products.createIndex( { product_id: 1 }, { unique: true });

db.products.insertMany([
// ==================== CLOTHING PRODUCTS ====================
  {
    "product_id": 101,
    "product_type": "clothing",
    "name": "Mens Jeans",
    "description": "This is a jeans for men",
    "base_price": 14.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1001",
        "size": "Small",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 47,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1002",
        "size": "Small",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 38,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1003",
        "size": "Medium",
        "color": "White",
        "price_adjustment": 1.00,
        "stock_quantity": 65,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1004",
        "size": "Medium",
        "color": "Black",
        "price_adjustment": 1.00,
        "stock_quantity": 52,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1005",
        "size": "Large",
        "color": "White",
        "price_adjustment": 2.00,
        "stock_quantity": 29,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1006",
        "size": "Large",
        "color": "Black",
        "price_adjustment": 2.00,
        "stock_quantity": 71,
        "active": true
      }
    ],
    "size_chart": "Small: 30 Waist: 80cm Seat: 100cm Thigh: 56cm\nMedium: 35 Waist: 93cm Seat: 113cm Thigh: 62cm\nLarge: 40 Waist: 105cm Seat: 124cm Thigh: 68cm",
    "fabric_type": "Jeans",
    "created_at": ISODate("2024-05-25T09:15:00Z"),
    "last_modified": ISODate("2025-03-10T14:30:00Z"),
    "primary_category_id": 2,
    "primary_category": "Mens Clothing"
  },
  {
    "product_id": 102,
    "product_type": "clothing",
    "name": "Womens Jeans",
    "description": "This is a jeans for women",
    "base_price": 19.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1007",
        "size": "Small",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 42,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1008",
        "size": "Small",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 56,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1009",
        "size": "Medium",
        "color": "White",
        "price_adjustment": 1.00,
        "stock_quantity": 33,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1010",
        "size": "Medium",
        "color": "Black",
        "price_adjustment": 1.00,
        "stock_quantity": 68,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1011",
        "size": "Large",
        "color": "White",
        "price_adjustment": 2.00,
        "stock_quantity": 24,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1012",
        "size": "Large",
        "color": "Black",
        "price_adjustment": 2.00,
        "stock_quantity": 59,
        "active": true
      }
    ],
    "size_chart": "Small: 25 Waist: 62cm Seat: 82cm Thigh: 45cm\nMedium: 29 Waist: 80cm Seat: 100cm Thigh: 50cm\nLarge: 34 Waist: 95cm Seat: 115cm Thigh: 60cm",
    "fabric_type": "Jeans",
    "created_at": ISODate("2024-05-25T10:30:00Z"),
    "last_modified": ISODate("2025-02-05T11:45:00Z"),
    "primary_category_id": 3,
    "primary_category": "Womens Clothing"
  },
  {
    "product_id": 103,
    "product_type": "clothing",
    "name": "Mens Shirt",
    "description": "This is a shirt for men",
    "base_price": 9.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1013",
        "size": "Small",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 88,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1014",
        "size": "Small",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 72,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1015",
        "size": "Medium",
        "color": "White",
        "price_adjustment": 1.00,
        "stock_quantity": 64,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1016",
        "size": "Medium",
        "color": "Black",
        "price_adjustment": 1.00,
        "stock_quantity": 51,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1017",
        "size": "Large",
        "color": "White",
        "price_adjustment": 2.00,
        "stock_quantity": 37,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1018",
        "size": "Large",
        "color": "Black",
        "price_adjustment": 2.00,
        "stock_quantity": 43,
        "active": true
      }
    ],
    "size_chart": "Small: Width: 45cm Length: 70cm Chest-to-fit: 91cm - 99cm\nMedium: Width: 50cm Length: 75cm Chest-to-fit: 99cm - 106cm\nLarge: Width: 55cm Length: 80cm Chest-to-fit: 106cm - 114cm",
    "fabric_type": "Cotton",
    "created_at": ISODate("2024-05-25T14:20:00Z"),
    "last_modified": ISODate("2025-03-15T10:10:00Z"),
    "primary_category_id": 2,
    "primary_category": "Mens Clothing"
  },
  {
    "product_id": 104,
    "product_type": "clothing",
    "name": "Womens Shirt",
    "description": "This is a shirt for women",
    "base_price": 14.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1019",
        "size": "Small",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 53,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1020",
        "size": "Small",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 67,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1021",
        "size": "Medium",
        "color": "White",
        "price_adjustment": 1.00,
        "stock_quantity": 48,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1022",
        "size": "Medium",
        "color": "Black",
        "price_adjustment": 1.00,
        "stock_quantity": 39,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1023",
        "size": "Large",
        "color": "White",
        "price_adjustment": 2.00,
        "stock_quantity": 26,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1024",
        "size": "Large",
        "color": "Black",
        "price_adjustment": 2.00,
        "stock_quantity": 58,
        "active": true
      }
    ],
    "size_chart": "Small: Width: 40cm Length: 58cm Waist: 38cm\nMedium: Width: 43cm Length: 61cm Waist: 41cm\nLarge: Width: 46cm Length: 63cm Waist: 44cm",
    "fabric_type": "Cotton",
    "created_at": ISODate("2024-05-25T16:45:00Z"),
    "last_modified": ISODate("2025-03-20T13:25:00Z"),
    "primary_category_id": 3,
    "primary_category": "Womens Clothing"
  },
  {
    "product_id": 105,
    "product_type": "clothing",
    "name": "Scarf",
    "description": "This is a unisex scarf",
    "base_price": 11.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1025",
        "size": "Small",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 92,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1026",
        "size": "Small",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 85,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1027",
        "size": "Medium",
        "color": "White",
        "price_adjustment": 1.00,
        "stock_quantity": 77,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1028",
        "size": "Medium",
        "color": "Black",
        "price_adjustment": 1.00,
        "stock_quantity": 63,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1029",
        "size": "Large",
        "color": "White",
        "price_adjustment": 2.00,
        "stock_quantity": 41,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1030",
        "size": "Large",
        "color": "Black",
        "price_adjustment": 2.00,
        "stock_quantity": 34,
        "active": true
      }
    ],
    "size_chart": "Small: Width: 40cm Length: 60cm\nMedium: Width: 40cm Length: 90cm\nLarge: Width: 40cm Length: 120cm",
    "fabric_type": "Wool",
    "created_at": ISODate("2024-05-25T17:20:00Z"),
    "last_modified": ISODate("2024-12-15T09:40:00Z"),
    "primary_category_id": 5,
    "primary_category": "Winter Wear"
  },
// ==================== ELECTRONICS PRODUCTS ====================
  {
    "product_id": 201,
    "product_type": "electronics",
    "name": "iPhone Charger",
    "description": "This is an iPhone charger",
    "base_price": 24.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1031",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 42,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1032",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 35,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1033",
        "color": "Navy Blue",
        "price_adjustment": 0.00,
        "stock_quantity": 28,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1034",
        "color": "Emerald Green",
        "price_adjustment": 0.00,
        "stock_quantity": 19,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1035",
        "color": "Rose Gold",
        "price_adjustment": 0.00,
        "stock_quantity": 31,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1036",
        "color": "Dark Grey",
        "price_adjustment": 0.00,
        "stock_quantity": 24,
        "active": true
      }
    ],
    "warranty_period": "6 months",
    "voltage_requirements": "110V - 240V 60W",
    "created_at": ISODate("2024-05-26T10:15:00Z"),
    "last_modified": ISODate("2024-11-12T14:30:00Z"),
    "primary_category_id": 7,
    "primary_category": "Electronic Accessories"
  },
  {
    "product_id": 202,
    "product_type": "electronics",
    "name": "Android Charger",
    "description": "This is an android charger",
    "base_price": 14.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1037",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 58,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1038",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 47,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1039",
        "color": "Navy Blue",
        "price_adjustment": 0.00,
        "stock_quantity": 36,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1040",
        "color": "Emerald Green",
        "price_adjustment": 0.00,
        "stock_quantity": 29,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1041",
        "color": "Rose Gold",
        "price_adjustment": 0.00,
        "stock_quantity": 41,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1042",
        "color": "Dark Grey",
        "price_adjustment": 0.00,
        "stock_quantity": 33,
        "active": true
      }
    ],
    "warranty_period": "6 months",
    "voltage_requirements": "110V - 240V 60W",
    "created_at": ISODate("2024-05-26T11:30:00Z"),
    "last_modified": ISODate("2024-10-05T10:45:00Z"),
    "primary_category_id": 7,
    "primary_category": "Electronic Accessories"
  },
  {
    "product_id": 203,
    "product_type": "electronics",
    "name": "Earbuds",
    "description": "High Quality Bluetooth Earbuds",
    "base_price": 9.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1043",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 72,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1044",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 65,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1045",
        "color": "Navy Blue",
        "price_adjustment": 0.00,
        "stock_quantity": 53,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1046",
        "color": "Emerald Green",
        "price_adjustment": 0.00,
        "stock_quantity": 48,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1047",
        "color": "Rose Gold",
        "price_adjustment": 0.00,
        "stock_quantity": 57,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1048",
        "color": "Dark Grey",
        "price_adjustment": 0.00,
        "stock_quantity": 39,
        "active": true
      }
    ],
    "warranty_period": "12 months",
    "voltage_requirements": "5V 1A",
    "created_at": ISODate("2024-05-26T14:20:00Z"),
    "last_modified": ISODate("2025-04-15T11:10:00Z"),
    "primary_category_id": 10,
    "primary_category": "Audio"
  },
  {
    "product_id": 204,
    "product_type": "electronics",
    "name": "Headphones",
    "description": "High Quality Bluetooth Headphones",
    "base_price": 19.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1049",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 38,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1050",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 29,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1051",
        "color": "Navy Blue",
        "price_adjustment": 0.00,
        "stock_quantity": 25,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1052",
        "color": "Emerald Green",
        "price_adjustment": 0.00,
        "stock_quantity": 18,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1053",
        "color": "Rose Gold",
        "price_adjustment": 0.00,
        "stock_quantity": 31,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1054",
        "color": "Dark Grey",
        "price_adjustment": 0.00,
        "stock_quantity": 22,
        "active": true
      }
    ],
    "warranty_period": "12 months",
    "voltage_requirements": "5V 1A",
    "created_at": ISODate("2024-05-26T16:45:00Z"),
    "last_modified": ISODate("2024-12-20T13:25:00Z"),
    "primary_category_id": 10,
    "primary_category": "Audio"
  },
  {
    "product_id": 205,
    "product_type": "electronics",
    "name": "Smartwatch",
    "description": "High Quality Smartwatch. Phone companion and health monitor.",
    "base_price": 19.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1055",
        "color": "Black",
        "price_adjustment": 0.00,
        "stock_quantity": 51,
        "active": true
      },
      {
        "variant_id": 2,
        "sku": "INV1056",
        "color": "White",
        "price_adjustment": 0.00,
        "stock_quantity": 43,
        "active": true
      },
      {
        "variant_id": 3,
        "sku": "INV1057",
        "color": "Navy Blue",
        "price_adjustment": 0.00,
        "stock_quantity": 37,
        "active": true
      },
      {
        "variant_id": 4,
        "sku": "INV1058",
        "color": "Emerald Green",
        "price_adjustment": 0.00,
        "stock_quantity": 29,
        "active": true
      },
      {
        "variant_id": 5,
        "sku": "INV1059",
        "color": "Rose Gold",
        "price_adjustment": 0.00,
        "stock_quantity": 48,
        "active": true
      },
      {
        "variant_id": 6,
        "sku": "INV1060",
        "color": "Dark Grey",
        "price_adjustment": 0.00,
        "stock_quantity": 32,
        "active": true
      }
    ],
    "warranty_period": "12 months",
    "voltage_requirements": "5V 1A",
    "created_at": ISODate("2024-05-26T17:30:00Z"),
    "last_modified": ISODate("2024-09-15T09:40:00Z"),
    "primary_category_id": 8,
    "primary_category": "Smart Devices"
  },
// ==================== PET PRODUCTS ====================
  {
    "product_id": 301,
    "product_type": "pets",
    "name": "Cat Food",
    "description": "This is a great choice of food for a healthy cat",
    "base_price": 4.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1061",
        "size": "Kitten 0.5 kg",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 2,
        "sku": "INV1062",
        "size": "Adult 0.5 kg",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 3,
        "sku": "INV1063",
        "size": "Kitten 1.0 kg",
        "price_adjustment": 3.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 4,
        "sku": "INV1064",
        "size": "Adult 1.0 kg",
        "price_adjustment": 3.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 5,
        "sku": "INV1065",
        "size": "Kitten 1.5 kg",
        "price_adjustment": 5.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 6,
        "sku": "INV1066",
        "size": "Adult 1.5 kg",
        "price_adjustment": 5.00,
        "stock_quantity": 0,
        "active": false
      }
    ],
    "pet_type": "Cats",
    "material": "Fish, Chicken, Beef, Vegetables",
    "created_at": ISODate("2025-05-15T08:00:00Z"),
    "last_modified": ISODate("2025-05-16T09:15:22Z"),
    "primary_category_id": null,
    "primary_category": null
  },
  {
    "product_id": 302,
    "product_type": "pets",
    "name": "Cat Snacks",
    "description": "Delicious snacks for your cat",
    "base_price": 2.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1067",
        "size": "5 Treets",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 2,
        "sku": "INV1068",
        "size": "10 Treets",
        "price_adjustment": 2.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 3,
        "sku": "INV1069",
        "size": "15 Treets",
        "price_adjustment": 3.50,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 4,
        "sku": "INV1070",
        "size": "20 Treets",
        "price_adjustment": 5.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 5,
        "sku": "INV1071",
        "size": "25 Treets",
        "price_adjustment": 6.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 6,
        "sku": "INV1072",
        "size": "30 Treets",
        "price_adjustment": 7.00,
        "stock_quantity": 0,
        "active": false
      }
    ],
    "pet_type": "Cats",
    "material": "Fish, Chicken, Beef, Vegetables",
    "created_at": ISODate("2025-05-15T10:00:00Z"),
    "last_modified": ISODate("2025-05-16T10:30:45Z"),
    "primary_category_id": null,
    "primary_category": null
  },
  {
    "product_id": 303,
    "product_type": "pets",
    "name": "Dog Food",
    "description": "This is a great choice of food for a healthy dog",
    "base_price": 4.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1073",
        "size": "Puppy 0.5 kg",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 2,
        "sku": "INV1074",
        "size": "Adult 0.5 kg",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 3,
        "sku": "INV1075",
        "size": "Puppy 1.0 kg",
        "price_adjustment": 3.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 4,
        "sku": "INV1076",
        "size": "Adult 1.0 kg",
        "price_adjustment": 3.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 5,
        "sku": "INV1077",
        "size": "Puppy 1.5 kg",
        "price_adjustment": 5.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 6,
        "sku": "INV1078",
        "size": "Adult 1.5 kg",
        "price_adjustment": 5.00,
        "stock_quantity": 0,
        "active": false
      }
    ],
    "pet_type": "Dogs",
    "material": "Fish, Chicken, Beef, Vegetables",
    "created_at": ISODate("2025-05-15T12:00:00Z"),
    "last_modified": ISODate("2025-05-16T11:45:18Z"),
    "primary_category_id": null,
    "primary_category": null
  },
  {
    "product_id": 304,
    "product_type": "pets",
    "name": "Dog Snacks",
    "description": "Delicious snacks for your dog",
    "base_price": 2.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1079",
        "size": "5 Treets",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 2,
        "sku": "INV1080",
        "size": "10 Treets",
        "price_adjustment": 2.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 3,
        "sku": "INV1081",
        "size": "15 Treets",
        "price_adjustment": 3.50,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 4,
        "sku": "INV1082",
        "size": "20 Treets",
        "price_adjustment": 5.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 5,
        "sku": "INV1083",
        "size": "25 Treets",
        "price_adjustment": 6.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 6,
        "sku": "INV1084",
        "size": "30 Treets",
        "price_adjustment": 7.00,
        "stock_quantity": 0,
        "active": false
      }
    ],
    "pet_type": "Dogs",
    "material": "Fish, Chicken, Beef, Vegetables",
    "created_at": ISODate("2025-05-15T14:00:00Z"),
    "last_modified": ISODate("2025-05-16T14:20:33Z"),
    "primary_category_id": null,
    "primary_category": null
  },
  {
    "product_id": 305,
    "product_type": "pets",
    "name": "Chew Toy",
    "description": "Great chew toy for dental health and lowering stress",
    "base_price": 1.99,
    "variants": [
      {
        "variant_id": 1,
        "sku": "INV1085",
        "size": "Small Bone",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 2,
        "sku": "INV1086",
        "size": "Medium Bone",
        "price_adjustment": 2.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 3,
        "sku": "INV1087",
        "size": "Large Bone",
        "price_adjustment": 3.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 4,
        "sku": "INV1088",
        "size": "Small Fish",
        "price_adjustment": 0.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 5,
        "sku": "INV1089",
        "size": "Medium Fish",
        "price_adjustment": 2.00,
        "stock_quantity": 0,
        "active": false
      },
      {
        "variant_id": 6,
        "sku": "INV1090",
        "size": "Large Fish",
        "price_adjustment": 3.00,
        "stock_quantity": 0,
        "active": false
      }
    ],
    "pet_type": "Dogs, Cats",
    "material": "Natural Rubber",
    "created_at": ISODate("2025-05-15T16:00:00Z"),
    "last_modified": ISODate("2025-05-16T16:40:15Z"),
    "primary_category_id": null,
    "primary_category": null
  }
]);


/*
=========================================================CATEGORIES============================================================
=========================================================CATEGORIES============================================================
=========================================================CATEGORIES============================================================
*/

db.createCollection("categories", {
  validator: {
    $jsonSchema: {
    bsonType: "object",
    required: ["name"],
    properties: {
      name: {
        bsonType: "string",
        maxLength: 25,
        description: "Category name is required and must be a unique string"
      }
    }
  }
  }
});

db.categories.createIndex( { category_id: 1 }, { unique: true });

db.categories.insertMany([
  {
    "category_id": 1,
    "name": "Clothing",
    "description": "These are all of the clothing items available on the store",
    "created_at": ISODate("2024-05-27T09:30:00Z"),
    "last_modified": ISODate("2024-05-27T09:30:00Z"),
    "products": [101, 102, 103, 104, 105]
  },
  {
    "category_id": 2,
    "name": "Mens Clothing",
    "description": "These clothing items are for men",
    "created_at": ISODate("2024-05-27T09:45:00Z"),
    "last_modified": ISODate("2024-05-27T09:45:00Z"),
    "products": [101, 103]
  },
  {
    "category_id": 3,
    "name": "Womens Clothing",
    "description": "These clothing items are for women",
    "created_at": ISODate("2024-05-27T10:01:00Z"),
    "last_modified": ISODate("2024-05-27T10:01:00Z"),
    "products": [102, 104]
  },
  {
    "category_id": 4,
    "name": "Clothing Accessories",
    "description": "These are accessories for your outfits",
    "created_at": ISODate("2024-05-27T10:17:00Z"),
    "last_modified": ISODate("2024-05-27T10:17:00Z"),
    "products": [105]
  },
  {
    "category_id": 5,
    "name": "Winter Wear",
    "description": "These are winter clothing items",
    "created_at": ISODate("2024-05-27T10:33:00Z"),
    "last_modified": ISODate("2024-05-27T10:33:00Z"),
    "products": [105]
  },
  {
    "category_id": 6,
    "name": "Electronics",
    "description": "These are all of the electronic items available on the store",
    "created_at": ISODate("2024-05-27T11:30:00Z"),
    "last_modified": ISODate("2024-05-27T11:30:00Z"),
    "products": [201, 202, 203, 204, 205]
  },
  {
    "category_id": 7,
    "name": "Electronic Accessories",
    "description": "These are accessories for your smart devices/phones",
    "created_at": ISODate("2024-05-27T11:48:00Z"),
    "last_modified": ISODate("2024-05-27T11:48:00Z"),
    "products": [201, 202]
  },
  {
    "category_id": 8,
    "name": "Smart Devices",
    "description": "These are smart IoT devices that work with your smart phone",
    "created_at": ISODate("2024-05-27T12:23:00Z"),
    "last_modified": ISODate("2024-05-27T12:23:00Z"),
    "products": [205]
  },
  {
    "category_id": 9,
    "name": "Health",
    "description": "These electronic items help monitoring Health",
    "created_at": ISODate("2024-05-27T14:45:00Z"),
    "last_modified": ISODate("2024-05-27T14:45:00Z"),
    "products": [205]
  },
  {
    "category_id": 10,
    "name": "Audio",
    "description": "These are all of the equipments available on the store",
    "created_at": ISODate("2024-05-27T16:56:00Z"),
    "last_modified": ISODate("2024-05-27T16:56:00Z"),
    "products": [203, 204]
  },
  {
    "category_id": 11,
    "name": "Pets",
    "description": "These are all of the pet items available on the store",
    "created_at": ISODate("2024-12-27T16:56:00Z"),
    "last_modified": ISODate("2024-12-27T16:56:00Z"),
    "products": []
  },
  {
    "category_id": 12,
    "name": "Cat Food",
    "description": "These are all of the cat food options available on the store",
    "created_at": ISODate("2024-12-27T16:56:00Z"),
    "last_modified": ISODate("2024-12-27T16:56:00Z"),
    "products": []
  },
  {
    "category_id": 13,
    "name": "Dog Food",
    "description": "These are all of the dog food options available on the store",
    "created_at": ISODate("2024-12-27T16:56:00Z"),
    "last_modified": ISODate("2024-12-27T16:56:00Z"),
    "products": []
  },
  {
    "category_id": 14,
    "name": "Pet Toys",
    "description": "These are all of the pet toys options on the store",
    "created_at": ISODate("2024-12-27T16:56:00Z"),
    "last_modified": ISODate("2024-12-27T16:56:00Z"),
    "products": []
  },
  {
    "category_id": 15,
    "name": "Pet Snacks",
    "description": "These are all of the pet snacks options on the store",
    "created_at": ISODate("2024-12-27T16:56:00Z"),
    "last_modified": ISODate("2024-12-27T16:56:00Z"),
    "products": []
  }
]);


/*
=========================================================ORDERS============================================================
=========================================================ORDERS============================================================
=========================================================ORDERS============================================================
*/

db.createCollection("orders", {
  validator: {
    $jsonSchema: {
    bsonType: "object",
    required: ["user","item","status","total_amount","shipping_address"],
    properties: {
      user: {
        bsonType: "string",
        maxLength: 50,
        description: "The name of the user is required"
      },
      item: {
        bsonType: "object",
        description: "An item must exist in an order"
      },
      status: {
        bsonType: "string",
        maxLength: 25,
        description: "Order must have a status e.g. Pending Payment, Processing, Shipped, Delivered, etc."
      },
      total_amount: {
        bsonType: "decimal",
        description: "There should be an order total e.g. 24.86"
      },
      shipping_address: {
        bsonType: "object",
        description: "An order must have a shipping address"
      },
    }
  }
  }
});

db.orders.createIndex( { order_id: 1 }, { unique: true });

db.orders.insertMany([
  {
    "order_id": 1,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "10 Downing Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-06-06T09:15:22Z"),
    "last_modified": ISODate("2024-06-13T09:15:22Z")
  },
  {
    "order_id": 2,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.24"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-06-08T14:30:00Z"),
    "last_modified": ISODate("2024-06-15T14:30:00Z")
  },
  {
    "order_id": 3,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 2,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("35.78"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-06-15T11:45:33Z"),
    "last_modified": ISODate("2024-06-22T11:45:33Z")
  },
  {
    "order_id": 4,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.99"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-06-17T16:20:18Z"),
    "last_modified": ISODate("2024-06-24T16:20:18Z")
  },
  {
    "order_id": 5,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.10")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.89"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-06-20T10:30:45Z"),
    "last_modified": ISODate("2024-06-27T10:30:45Z")
  },
  {
    "order_id": 6,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("16.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("16.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-03T11:20:15Z"),
    "last_modified": ISODate("2024-07-10T11:20:15Z")
  },
  {
    "order_id": 7,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("21.99"),
      "discount_amount": NumberDecimal("4.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("17.19"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-05T14:45:00Z"),
    "last_modified": ISODate("2024-07-12T14:45:00Z")
  },
  {
    "order_id": 8,
    "user_id": 3,
    "user": "David Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.19"),
    "shipping_address": {
      "recipient_name": "David Wilson",
      "street": "7 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-07T09:30:33Z"),
    "last_modified": ISODate("2024-07-14T09:30:33Z")
  },
  {
    "order_id": 9,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.38"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-09T16:15:18Z"),
    "last_modified": ISODate("2024-07-16T16:15:18Z")
  },
  {
    "order_id": 10,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-11T13:20:45Z"),
    "last_modified": ISODate("2024-07-18T13:20:45Z")
  },
  {
    "order_id": 11,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.74"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-14T10:10:30Z"),
    "last_modified": ISODate("2024-07-21T10:10:30Z")
  },
  {
    "order_id": 12,
    "user_id": 3,
    "user": "David Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("14.99"),
    "shipping_address": {
      "recipient_name": "David Wilson",
      "street": "7 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2024-07-17T15:30:15Z"),
    "last_modified": ISODate("2024-07-24T15:30:15Z")
  },
  {
    "order_id": 13,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("2.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("7.74"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "15 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-02T09:45:00Z"),
    "last_modified": ISODate("2024-08-09T09:45:00Z")
  },
  {
    "order_id": 14,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-04T14:20:33Z"),
    "last_modified": ISODate("2024-08-11T14:20:33Z")
  },
  {
    "order_id": 15,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.50")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.49"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-06T11:15:18Z"),
    "last_modified": ISODate("2024-08-13T11:15:18Z")
  },
  {
    "order_id": 16,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-08T16:30:45Z"),
    "last_modified": ISODate("2024-08-15T16:30:45Z")
  },
  {
    "order_id": 17,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "15 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-10T10:40:30Z"),
    "last_modified": ISODate("2024-08-17T10:40:30Z")
  },
  {
    "order_id": 18,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("1.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.09"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-12T13:25:15Z"),
    "last_modified": ISODate("2024-08-19T13:25:15Z")
  },
  {
    "order_id": 19,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.59"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-15T09:50:00Z"),
    "last_modified": ISODate("2024-08-22T09:50:00Z")
  },
  {
    "order_id": 20,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "15 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2024-08-18T15:35:45Z"),
    "last_modified": ISODate("2024-08-25T15:35:45Z")
  },
  {
    "order_id": 21,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-01T11:10:30Z"),
    "last_modified": ISODate("2024-09-08T11:10:30Z")
  },
  {
    "order_id": 22,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("14.99"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-03T14:45:15Z"),
    "last_modified": ISODate("2024-09-10T14:45:15Z")
  },
  {
    "order_id": 23,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.23"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-05T10:20:00Z"),
    "last_modified": ISODate("2024-09-12T10:20:00Z")
  },
  {
    "order_id": 24,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-07T16:55:45Z"),
    "last_modified": ISODate("2024-09-14T16:55:45Z")
  },
  {
    "order_id": 25,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-09T09:30:30Z"),
    "last_modified": ISODate("2024-09-16T09:30:30Z")
  },
  {
    "order_id": 26,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-11T13:15:15Z"),
    "last_modified": ISODate("2024-09-18T13:15:15Z")
  },
  {
    "order_id": 27,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-14T10:40:00Z"),
    "last_modified": ISODate("2024-09-21T10:40:00Z")
  },
  {
    "order_id": 28,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Lisa Taylor",
      "street": "12 Camden High Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 0JH",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-16T15:25:45Z"),
    "last_modified": ISODate("2024-09-23T15:25:45Z")
  },
  {
    "order_id": 29,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-18T11:50:30Z"),
    "last_modified": ISODate("2024-09-25T11:50:30Z")
  },
  {
    "order_id": 30,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-20T14:35:15Z"),
    "last_modified": ISODate("2024-09-27T14:35:15Z")
  },
  {
    "order_id": 31,
    "user_id": 3,
    "user": "David Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "David Wilson",
      "street": "7 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-22T09:10:00Z"),
    "last_modified": ISODate("2024-09-29T09:10:00Z")
  },
  {
    "order_id": 32,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-24T16:45:45Z"),
    "last_modified": ISODate("2024-10-01T16:45:45Z")
  },
  {
    "order_id": 33,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-26T12:20:30Z"),
    "last_modified": ISODate("2024-10-03T12:20:30Z")
  },
  {
    "order_id": 34,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "Lisa Taylor",
      "street": "12 Camden High Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 0JH",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-28T10:55:15Z"),
    "last_modified": ISODate("2024-10-05T10:55:15Z")
  },
  {
    "order_id": 35,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-09-30T15:30:00Z"),
    "last_modified": ISODate("2024-10-07T15:30:00Z")
  },
  {
    "order_id": 36,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.50")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.49"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-02T11:05:45Z"),
    "last_modified": ISODate("2024-10-09T11:05:45Z")
  },
  {
    "order_id": 37,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-04T14:40:30Z"),
    "last_modified": ISODate("2024-10-11T14:40:30Z")
  },
  {
    "order_id": 38,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 103,
      "quantity": 2,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.10")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.88"),
    "shipping_address": {
      "recipient_name": "Robert Brown",
      "street": "8 Bond Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1S 1YF",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-06T09:15:15Z"),
    "last_modified": ISODate("2024-10-13T09:15:15Z")
  },
  {
    "order_id": 39,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.39"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-08T16:50:00Z"),
    "last_modified": ISODate("2024-10-15T16:50:00Z")
  },
  {
    "order_id": 40,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "25 Knightsbridge",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 7LY",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-10T12:25:45Z"),
    "last_modified": ISODate("2024-10-17T12:25:45Z")
  },
  {
    "order_id": 41,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.74"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "25 Knightsbridge",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 7LY",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-12T10:00:30Z"),
    "last_modified": ISODate("2024-10-19T10:00:30Z")
  },
  {
    "order_id": 42,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.09"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-14T15:35:15Z"),
    "last_modified": ISODate("2024-10-21T15:35:15Z")
  },
  {
    "order_id": 43,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.85")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.14"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-16T11:10:00Z"),
    "last_modified": ISODate("2024-10-23T11:10:00Z")
  },
  {
    "order_id": 44,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.35")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.64"),
    "shipping_address": {
      "recipient_name": "Robert Brown",
      "street": "8 Bond Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1S 1YF",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-18T14:45:45Z"),
    "last_modified": ISODate("2024-10-25T14:45:45Z")
  },
  {
    "order_id": 45,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-20T09:20:30Z"),
    "last_modified": ISODate("2024-10-27T09:20:30Z")
  },
  {
    "order_id": 46,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-22T16:55:15Z"),
    "last_modified": ISODate("2024-10-29T16:55:15Z")
  },
  {
    "order_id": 47,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "25 Knightsbridge",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 7LY",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-24T12:30:00Z"),
    "last_modified": ISODate("2024-10-31T12:30:00Z")
  },
  {
    "order_id": 48,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-26T10:05:45Z"),
    "last_modified": ISODate("2024-11-02T10:05:45Z")
  },
  {
    "order_id": 49,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-28T15:40:30Z"),
    "last_modified": ISODate("2024-11-04T15:40:30Z")
  },
  {
    "order_id": 50,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-10-30T11:15:15Z"),
    "last_modified": ISODate("2024-11-06T11:15:15Z")
  },
  {
    "order_id": 51,
    "user_id": 3,
    "user": "David Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "David Wilson",
      "street": "7 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-03T14:20:00Z"),
    "last_modified": ISODate("2024-11-10T14:20:00Z")
  },
  {
    "order_id": 52,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-05T09:45:45Z"),
    "last_modified": ISODate("2024-11-12T09:45:45Z")
  },
  {
    "order_id": 53,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-07T16:30:30Z"),
    "last_modified": ISODate("2024-11-14T16:30:30Z")
  },
  {
    "order_id": 54,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-09T12:05:15Z"),
    "last_modified": ISODate("2024-11-16T12:05:15Z")
  },
  {
    "order_id": 55,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-11T10:40:00Z"),
    "last_modified": ISODate("2024-11-18T10:40:00Z")
  },
  {
    "order_id": 56,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-13T15:15:45Z"),
    "last_modified": ISODate("2024-11-20T15:15:45Z")
  },
  {
    "order_id": 57,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-15T11:50:30Z"),
    "last_modified": ISODate("2024-11-22T11:50:30Z")
  },
  {
    "order_id": 58,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-17T14:25:15Z"),
    "last_modified": ISODate("2024-11-24T14:25:15Z")
  },
  {
    "order_id": 59,
    "user_id": 3,
    "user": "David Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "David Wilson",
      "street": "7 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-19T09:00:00Z"),
    "last_modified": ISODate("2024-12-10T09:00:00Z")
  },
  {
    "order_id": 60,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-21T16:35:45Z"),
    "last_modified": ISODate("2024-11-28T16:35:45Z")
  },
  {
    "order_id": 61,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-23T12:10:30Z"),
    "last_modified": ISODate("2024-11-30T12:10:30Z")
  },
  {
    "order_id": 62,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-25T10:45:15Z"),
    "last_modified": ISODate("2024-12-02T10:45:15Z")
  },
  {
    "order_id": 63,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-27T15:20:00Z"),
    "last_modified": ISODate("2024-12-04T15:20:00Z")
  },
  {
    "order_id": 64,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-29T11:55:45Z"),
    "last_modified": ISODate("2024-12-06T11:55:45Z")
  },
  {
    "order_id": 65,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-11-30T14:30:30Z"),
    "last_modified": ISODate("2024-12-07T14:30:30Z")
  },
  {
    "order_id": 66,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-01T13:50:30Z"),
    "last_modified": ISODate("2024-12-08T13:50:30Z")
  },
  {
    "order_id": 67,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.50")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.49"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-02T09:05:15Z"),
    "last_modified": ISODate("2024-12-09T09:05:15Z")
  },
  {
    "order_id": 68,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-03T08:25:15Z"),
    "last_modified": ISODate("2024-12-10T08:25:15Z")
  },
  {
    "order_id": 69,
    "user_id": 3,
    "user": "David Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "David Wilson",
      "street": "7 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-04T16:40:00Z"),
    "last_modified": ISODate("2024-12-10T16:40:00Z")
  },
  {
    "order_id": 70,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-05T15:00:00Z"),
    "last_modified": ISODate("2024-12-12T15:00:00Z")
  },
  {
    "order_id": 71,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 103,
      "quantity": 2,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.10")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.88"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-06T12:15:45Z"),
    "last_modified": ISODate("2024-12-13T12:15:45Z")
  },
  {
    "order_id": 72,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-07T10:35:45Z"),
    "last_modified": ISODate("2024-12-14T10:35:45Z")
  },
  {
    "order_id": 73,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.39"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-08T10:50:30Z"),
    "last_modified": ISODate("2024-12-15T10:50:30Z")
  },
  {
    "order_id": 74,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-09T14:10:30Z"),
    "last_modified": ISODate("2024-12-16T14:10:30Z")
  },
  {
    "order_id": 75,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-10T15:25:15Z"),
    "last_modified": ISODate("2024-12-17T15:25:15Z")
  },
  {
    "order_id": 76,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.74"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-12T11:00:00Z"),
    "last_modified": ISODate("2024-12-19T11:00:00Z")
  },
  {
    "order_id": 77,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-11T11:45:15Z"),
    "last_modified": ISODate("2024-12-18T11:45:15Z")
  },
  {
    "order_id": 78,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-13T16:20:00Z"),
    "last_modified": ISODate("2024-12-20T16:20:00Z")
  },
  {
    "order_id": 79,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.09"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-14T14:35:45Z"),
    "last_modified": ISODate("2024-12-21T14:35:45Z")
  },
  {
    "order_id": 80,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-15T09:55:45Z"),
    "last_modified": ISODate("2024-12-22T09:55:45Z")
  },
  {
    "order_id": 81,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.85")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.14"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "9 Covent Garden",
      "city": "London",
      "state": "England",
      "zip_code": "WC2E 8RA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-16T09:10:30Z"),
    "last_modified": ISODate("2024-12-23T09:10:30Z")
  },
  {
    "order_id": 82,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-17T14:30:30Z"),
    "last_modified": ISODate("2024-12-24T14:30:30Z")
  },
  {
    "order_id": 83,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.35")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.64"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "9 Covent Garden",
      "city": "London",
      "state": "England",
      "zip_code": "WC2E 8RA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-18T16:45:15Z"),
    "last_modified": ISODate("2024-12-25T16:45:15Z")
  },
  {
    "order_id": 84,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-19T12:05:15Z"),
    "last_modified": ISODate("2024-12-26T12:05:15Z")
  },
  {
    "order_id": 85,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-20T12:20:00Z"),
    "last_modified": ISODate("2024-12-27T12:20:00Z")
  },
  {
    "order_id": 86,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-22T10:55:45Z"),
    "last_modified": ISODate("2024-12-29T10:55:45Z")
  },
  {
    "order_id": 87,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "9 Covent Garden",
      "city": "London",
      "state": "England",
      "zip_code": "WC2E 8RA",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-24T15:30:30Z"),
    "last_modified": ISODate("2024-12-31T15:30:30Z")
  },
  {
    "order_id": 88,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-26T11:05:15Z"),
    "last_modified": ISODate("2025-01-02T11:05:15Z")
  },
  {
    "order_id": 89,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-28T14:40:00Z"),
    "last_modified": ISODate("2025-01-04T14:40:00Z")
  },
  {
    "order_id": 90,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2024-12-30T09:15:45Z"),
    "last_modified": ISODate("2025-01-06T09:15:45Z")
  },
  {
    "order_id": 91,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-02T11:50:30Z"),
    "last_modified": ISODate("2025-01-09T11:50:30Z")
  },
  {
    "order_id": 92,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-03T09:40:00Z"),
    "last_modified": ISODate("2025-01-10T09:40:00Z")
  },
  {
    "order_id": 93,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-04T14:25:15Z"),
    "last_modified": ISODate("2025-01-11T14:25:15Z")
  },
  {
    "order_id": 94,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "21 Leicester Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2H 7LE",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-05T14:15:45Z"),
    "last_modified": ISODate("2025-01-12T14:15:45Z")
  },
  {
    "order_id": 95,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-06T09:00:00Z"),
    "last_modified": ISODate("2025-01-13T09:00:00Z")
  },
  {
    "order_id": 96,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-07T11:50:30Z"),
    "last_modified": ISODate("2025-01-14T11:50:30Z")
  },
  {
    "order_id": 97,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "5 Carnaby Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1F 9PB",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-09T16:25:15Z"),
    "last_modified": ISODate("2025-01-16T16:25:15Z")
  },
  {
    "order_id": 98,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-11T10:00:00Z"),
    "last_modified": ISODate("2025-01-18T10:00:00Z")
  },
  {
    "order_id": 99,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.50")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.49"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-13T13:35:45Z"),
    "last_modified": ISODate("2025-01-20T13:35:45Z")
  },
  {
    "order_id": 100,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Lisa Taylor",
      "street": "12 Camden High Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 0JH",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-15T08:10:30Z"),
    "last_modified": ISODate("2025-01-22T08:10:30Z")
  },
  {
    "order_id": 101,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 103,
      "quantity": 2,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.10")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.88"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-17T14:45:15Z"),
    "last_modified": ISODate("2025-01-24T14:45:15Z")
  },
  {
    "order_id": 102,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.39"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-19T11:20:00Z"),
    "last_modified": ISODate("2025-01-26T11:20:00Z")
  },
  {
    "order_id": 103,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "5 Carnaby Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1F 9PB",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-21T15:55:45Z"),
    "last_modified": ISODate("2025-01-28T15:55:45Z")
  },
  {
    "order_id": 104,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.74"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-23T10:30:30Z"),
    "last_modified": ISODate("2025-01-30T10:30:30Z")
  },
  {
    "order_id": 105,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.09"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-25T13:05:15Z"),
    "last_modified": ISODate("2025-02-01T13:05:15Z")
  },
  {
    "order_id": 106,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.85")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.14"),
    "shipping_address": {
      "recipient_name": "William Davis",
      "street": "33 Shaftesbury Avenue",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 7EH",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-27T08:40:00Z"),
    "last_modified": ISODate("2025-02-03T08:40:00Z")
  },
  {
    "order_id": 107,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.35")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.64"),
    "shipping_address": {
      "recipient_name": "Lisa Taylor",
      "street": "12 Camden High Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 0JH",
      "country": "UK"
    },
    "created_at": ISODate("2025-01-29T16:15:45Z"),
    "last_modified": ISODate("2025-02-05T16:15:45Z")
  },
  {
    "order_id": 108,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-01T15:35:45Z"),
    "last_modified": ISODate("2025-02-08T15:35:45Z")
  },
  {
    "order_id": 109,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "21 Leicester Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2H 7LE",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-02T08:45:15Z"),
    "last_modified": ISODate("2025-02-09T08:45:15Z")
  },
  {
    "order_id": 110,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-03T12:10:30Z"),
    "last_modified": ISODate("2025-02-10T12:10:30Z")
  },
  {
    "order_id": 111,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-04T14:20:00Z"),
    "last_modified": ISODate("2025-02-11T14:20:00Z")
  },
  {
    "order_id": 112,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-05T08:45:15Z"),
    "last_modified": ISODate("2025-02-12T08:45:15Z")
  },
  {
    "order_id": 113,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-06T10:55:45Z"),
    "last_modified": ISODate("2025-02-13T10:55:45Z")
  },
  {
    "order_id": 114,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-07T14:20:00Z"),
    "last_modified": ISODate("2025-02-14T14:20:00Z")
  },
  {
    "order_id": 115,
    "user_id": 1,
    "user": "John Smith",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "John Smith",
      "street": "22 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "SW1A 2AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-08T17:30:30Z"),
    "last_modified": ISODate("2025-02-15T17:30:30Z")
  },
  {
    "order_id": 116,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "William Davis",
      "street": "33 Shaftesbury Avenue",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 7EH",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-09T10:55:45Z"),
    "last_modified": ISODate("2025-02-16T10:55:45Z")
  },
  {
    "order_id": 117,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-10T13:05:15Z"),
    "last_modified": ISODate("2025-02-17T13:05:15Z")
  },
  {
    "order_id": 118,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "18 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-11T17:30:30Z"),
    "last_modified": ISODate("2025-02-18T17:30:30Z")
  },
  {
    "order_id": 119,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-13T13:05:15Z"),
    "last_modified": ISODate("2025-02-20T13:05:15Z")
  },
  {
    "order_id": 120,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "William Moore",
      "street": "27 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-15T09:40:00Z"),
    "last_modified": ISODate("2025-02-22T09:40:00Z")
  },
  {
    "order_id": 121,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "18 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-17T16:15:45Z"),
    "last_modified": ISODate("2025-02-24T16:15:45Z")
  },
  {
    "order_id": 122,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-19T11:50:30Z"),
    "last_modified": ISODate("2025-02-26T11:50:30Z")
  },
  {
    "order_id": 123,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "William Moore",
      "street": "27 Baker Street",
      "city": "London",
      "state": "England",
      "zip_code": "NW1 6XE",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-21T14:25:15Z"),
    "last_modified": ISODate("2025-02-28T14:25:15Z")
  },
  {
    "order_id": 124,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-23T09:00:00Z"),
    "last_modified": ISODate("2025-03-02T09:00:00Z")
  },
  {
    "order_id": 125,
    "user_id": 12,
    "user": "Isabella Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Isabella Taylor",
      "street": "22 Jermyn Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 6HL",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-25T15:35:45Z"),
    "last_modified": ISODate("2025-03-04T15:35:45Z")
  },
  {
    "order_id": 126,
    "user_id": 12,
    "user": "Isabella Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "Isabella Taylor",
      "street": "22 Jermyn Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 6HL",
      "country": "UK"
    },
    "created_at": ISODate("2025-02-27T12:10:30Z"),
    "last_modified": ISODate("2025-03-06T12:10:30Z")
  },
  {
    "order_id": 127,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-01T09:40:00Z"),
    "last_modified": ISODate("2025-03-08T09:40:00Z")
  },
  {
    "order_id": 128,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "William Moore",
      "street": "8 Paddington Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 5QH",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-02T14:25:15Z"),
    "last_modified": ISODate("2025-03-09T14:25:15Z")
  },
  {
    "order_id": 129,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-03T16:15:45Z"),
    "last_modified": ISODate("2025-03-10T16:15:45Z")
  },
  {
    "order_id": 130,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "George Moore",
      "street": "15 Harley Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1G 9QQ",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-04T09:00:00Z"),
    "last_modified": ISODate("2025-03-11T09:00:00Z")
  },
  {
    "order_id": 131,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-05T11:50:30Z"),
    "last_modified": ISODate("2025-03-12T11:50:30Z")
  },
  {
    "order_id": 132,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "Thomas Anderson",
      "street": "9 The Strand",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5HR",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-06T15:35:45Z"),
    "last_modified": ISODate("2025-03-13T15:35:45Z")
  },
  {
    "order_id": 133,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-07T14:25:15Z"),
    "last_modified": ISODate("2025-03-14T14:25:15Z")
  },
  {
    "order_id": 134,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Sophie Anderson",
      "street": "31 Trafalgar Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5DN",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-08T12:10:30Z"),
    "last_modified": ISODate("2025-03-15T12:10:30Z")
  },
  {
    "order_id": 135,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-09T09:00:00Z"),
    "last_modified": ISODate("2025-03-16T09:00:00Z")
  },
  {
    "order_id": 136,
    "user_id": 2,
    "user": "Sarah Jones",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Sarah Jones",
      "street": "35 Oxford Street",
      "city": "Manchester",
      "state": "England",
      "zip_code": "M1 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-10T08:45:15Z"),
    "last_modified": ISODate("2025-03-17T08:45:15Z")
  },
  {
    "order_id": 137,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "21 Leicester Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2H 7LE",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-11T15:35:45Z"),
    "last_modified": ISODate("2025-03-18T15:35:45Z")
  },
  {
    "order_id": 138,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Sophie Anderson",
      "street": "31 Trafalgar Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5DN",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-12T14:20:00Z"),
    "last_modified": ISODate("2025-03-19T14:20:00Z")
  },
  {
    "order_id": 139,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "18 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-13T12:10:30Z"),
    "last_modified": ISODate("2025-03-20T12:10:30Z")
  },
  {
    "order_id": 140,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-14T10:55:45Z"),
    "last_modified": ISODate("2025-03-21T10:55:45Z")
  },
  {
    "order_id": 141,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-15T08:45:15Z"),
    "last_modified": ISODate("2025-03-22T08:45:15Z")
  },
  {
    "order_id": 142,
    "user_id": 5,
    "user": "Michael Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "Michael Taylor",
      "street": "3 Abbey Road",
      "city": "London",
      "state": "England",
      "zip_code": "NW8 9AY",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-16T17:30:30Z"),
    "last_modified": ISODate("2025-03-23T17:30:30Z")
  },
  {
    "order_id": 143,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "William Moore",
      "street": "8 Paddington Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 5QH",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-17T14:20:00Z"),
    "last_modified": ISODate("2025-03-24T14:20:00Z")
  },
  {
    "order_id": 144,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-18T13:05:15Z"),
    "last_modified": ISODate("2025-03-25T13:05:15Z")
  },
  {
    "order_id": 145,
    "user_id": 12,
    "user": "Isabella Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Isabella Taylor",
      "street": "22 Jermyn Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 6HL",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-19T10:55:45Z"),
    "last_modified": ISODate("2025-03-26T10:55:45Z")
  },
  {
    "order_id": 146,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Sophie Anderson",
      "street": "31 Trafalgar Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5DN",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-21T17:30:30Z"),
    "last_modified": ISODate("2025-03-28T17:30:30Z")
  },
  {
    "order_id": 147,
    "user_id": 14,
    "user": "Charlotte Thomas",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Charlotte Thomas",
      "street": "17 Pall Mall",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5LA",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-23T13:05:15Z"),
    "last_modified": ISODate("2025-03-30T13:05:15Z")
  },
  {
    "order_id": 148,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "Charlotte Moore",
      "street": "36 Marylebone High Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 4QE",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-25T09:40:00Z"),
    "last_modified": ISODate("2025-04-01T09:40:00Z")
  },
  {
    "order_id": 149,
    "user_id": 14,
    "user": "Charlotte Thomas",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Charlotte Thomas",
      "street": "17 Pall Mall",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5LA",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-27T16:15:45Z"),
    "last_modified": ISODate("2025-04-03T16:15:45Z")
  },
  {
    "order_id": 150,
    "user_id": 14,
    "user": "Charlotte Thomas",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "Charlotte Thomas",
      "street": "17 Pall Mall",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5LA",
      "country": "UK"
    },
    "created_at": ISODate("2025-03-29T11:50:30Z"),
    "last_modified": ISODate("2025-04-05T11:50:30Z")
  },
  {
    "order_id": 151,
    "user_id": 15,
    "user": "Daniel White",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Daniel White",
      "street": "4 St James's Square",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 4JU",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-01T08:35:45Z"),
    "last_modified": ISODate("2025-04-08T08:35:45Z")
  },
  {
    "order_id": 152,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-01T09:30:00Z"),
    "last_modified": ISODate("2025-04-08T09:30:00Z")
  },
  {
    "order_id": 153,
    "user_id": 15,
    "user": "Daniel White",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Daniel White",
      "street": "4 St James's Square",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 4JU",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-02T13:50:30Z"),
    "last_modified": ISODate("2025-04-09T13:50:30Z")
  },
  {
    "order_id": 154,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "21 Leicester Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2H 7LE",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-03T14:15:45Z"),
    "last_modified": ISODate("2025-04-10T14:15:45Z")
  },
  {
    "order_id": 155,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "Charlotte Moore",
      "street": "36 Marylebone High Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 4QE",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-03T15:10:30Z"),
    "last_modified": ISODate("2025-04-10T15:10:30Z")
  },
  {
    "order_id": 156,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "Thomas Anderson",
      "street": "9 The Strand",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5HR",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-04T08:25:15Z"),
    "last_modified": ISODate("2025-04-11T08:25:15Z")
  },
  {
    "order_id": 157,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "William Moore",
      "street": "8 Paddington Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 5QH",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-05T10:45:15Z"),
    "last_modified": ISODate("2025-04-12T10:45:15Z")
  },
  {
    "order_id": 158,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "18 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-05T10:50:30Z"),
    "last_modified": ISODate("2025-04-12T10:50:30Z")
  },
  {
    "order_id": 159,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Charlotte Moore",
      "street": "36 Marylebone High Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 4QE",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-06T15:00:00Z"),
    "last_modified": ISODate("2025-04-13T15:00:00Z")
  },
  {
    "order_id": 160,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-07T16:25:15Z"),
    "last_modified": ISODate("2025-04-14T16:25:15Z")
  },
  {
    "order_id": 161,
    "user_id": 4,
    "user": "Emma Brown",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Emma Brown",
      "street": "22 Piccadilly",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 0BH",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-08T10:35:45Z"),
    "last_modified": ISODate("2025-04-15T10:35:45Z")
  },
  {
    "order_id": 162,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Charlotte Moore",
      "street": "36 Marylebone High Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 4QE",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-09T11:00:00Z"),
    "last_modified": ISODate("2025-04-16T11:00:00Z")
  },
  {
    "order_id": 163,
    "user_id": 16,
    "user": "Matthew Martin",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "Matthew Martin",
      "street": "8 Berkeley Square",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 6DA",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-10T14:10:30Z"),
    "last_modified": ISODate("2025-04-17T14:10:30Z")
  },
  {
    "order_id": 164,
    "user_id": 12,
    "user": "Isabella Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Isabella Taylor",
      "street": "22 Jermyn Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 6HL",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-11T13:35:45Z"),
    "last_modified": ISODate("2025-04-18T13:35:45Z")
  },
  {
    "order_id": 165,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-12T11:45:15Z"),
    "last_modified": ISODate("2025-04-19T11:45:15Z")
  },
  {
    "order_id": 166,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Sophie Anderson",
      "street": "31 Trafalgar Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5DN",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-13T08:10:30Z"),
    "last_modified": ISODate("2025-04-20T08:10:30Z")
  },
  {
    "order_id": 167,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-14T16:20:00Z"),
    "last_modified": ISODate("2025-04-21T16:20:00Z")
  },
  {
    "order_id": 168,
    "user_id": 14,
    "user": "Charlotte Thomas",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Charlotte Thomas",
      "street": "17 Pall Mall",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5LA",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-15T14:45:15Z"),
    "last_modified": ISODate("2025-04-22T14:45:15Z")
  },
  {
    "order_id": 169,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "Sophia Davis",
      "street": "21 Leicester Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2H 7LE",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-16T12:55:45Z"),
    "last_modified": ISODate("2025-04-23T12:55:45Z")
  },
  {
    "order_id": 170,
    "user_id": 15,
    "user": "Daniel White",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "Lucy White",
      "street": "25 Cockspur Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5BN",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-17T10:20:00Z"),
    "last_modified": ISODate("2025-04-24T10:20:00Z")
  },
  {
    "order_id": 171,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "18 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-18T09:30:30Z"),
    "last_modified": ISODate("2025-04-25T09:30:30Z")
  },
  {
    "order_id": 172,
    "user_id": 16,
    "user": "Matthew Martin",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Matthew Martin",
      "street": "8 Berkeley Square",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 6DA",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-19T15:55:45Z"),
    "last_modified": ISODate("2025-04-26T15:55:45Z")
  },
  {
    "order_id": 173,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-20T14:05:15Z"),
    "last_modified": ISODate("2025-04-27T14:05:15Z")
  },
  {
    "order_id": 174,
    "user_id": 17,
    "user": "Emily Thompson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.90")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("20.09"),
    "shipping_address": {
      "recipient_name": "Emily Thompson",
      "street": "22 Mount Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 2RD",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-21T11:30:30Z"),
    "last_modified": ISODate("2025-04-28T11:30:30Z")
  },
  {
    "order_id": 175,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "George Moore",
      "street": "15 Harley Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1G 9QQ",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-22T10:40:00Z"),
    "last_modified": ISODate("2025-04-29T10:40:00Z")
  },
  {
    "order_id": 176,
    "user_id": 18,
    "user": "Andrew Robinson",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.19"),
    "shipping_address": {
      "recipient_name": "Andrew Robinson",
      "street": "7 Curzon Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 5HG",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-23T16:05:15Z"),
    "last_modified": ISODate("2025-04-30T16:05:15Z")
  },
  {
    "order_id": 177,
    "user_id": 12,
    "user": "Isabella Taylor",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Isabella Taylor",
      "street": "22 Jermyn Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 6HL",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-24T15:15:45Z"),
    "last_modified": ISODate("2025-05-01T15:15:45Z")
  },
  {
    "order_id": 178,
    "user_id": 16,
    "user": "Matthew Martin",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "Matthew Martin",
      "street": "15 Grosvenor Square",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 6JP",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-25T12:40:00Z"),
    "last_modified": ISODate("2025-05-02T12:40:00Z")
  },
  {
    "order_id": 179,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Sophie Anderson",
      "street": "31 Trafalgar Square",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5DN",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-26T11:50:30Z"),
    "last_modified": ISODate("2025-05-03T11:50:30Z")
  },
  {
    "order_id": 180,
    "user_id": 18,
    "user": "Andrew Robinson",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "Andrew Robinson",
      "street": "14 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 7AN",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-27T09:15:45Z"),
    "last_modified": ISODate("2025-05-04T09:15:45Z")
  },
  {
    "order_id": 181,
    "user_id": 14,
    "user": "Charlotte Thomas",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Charlotte Thomas",
      "street": "17 Pall Mall",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5LA",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-28T16:25:15Z"),
    "last_modified": ISODate("2025-05-05T16:25:15Z")
  },
  {
    "order_id": 182,
    "user_id": 15,
    "user": "Daniel White",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "Daniel White",
      "street": "12 Haymarket",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 4DQ",
      "country": "UK"
    },
    "created_at": ISODate("2025-04-30T13:00:00Z"),
    "last_modified": ISODate("2025-05-07T13:00:00Z")
  },
  {
    "order_id": 183,
    "user_id": 19,
    "user": "Sophie Clark",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 203,
      "quantity": 1,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.99"),
    "shipping_address": {
      "recipient_name": "Sophie Clark",
      "street": "5 Bruton Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1J 6PT",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-01T14:20:00Z"),
    "last_modified": ISODate("2025-05-08T14:20:00Z")
  },
  {
    "order_id": 184,
    "user_id": 9,
    "user": "Robert Miller",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.40")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.59"),
    "shipping_address": {
      "recipient_name": "Robert Miller",
      "street": "18 Regent Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1B 5AH",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-03T09:55:45Z"),
    "last_modified": ISODate("2025-05-10T09:55:45Z")
  },
  {
    "order_id": 185,
    "user_id": 16,
    "user": "Matthew Martin",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Matthew Martin",
      "street": "15 Grosvenor Square",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 6JP",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-05T16:30:30Z"),
    "last_modified": ISODate("2025-05-12T16:30:30Z")
  },
  {
    "order_id": 186,
    "user_id": 8,
    "user": "Sophia Davis",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 101,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.80")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("28.18"),
    "shipping_address": {
      "recipient_name": "William Davis",
      "street": "33 Shaftesbury Avenue",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 7EH",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-07T12:05:15Z"),
    "last_modified": ISODate("2025-05-14T12:05:15Z")
  },
  {
    "order_id": 187,
    "user_id": 11,
    "user": "William Moore",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.45")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("15.54"),
    "shipping_address": {
      "recipient_name": "Charlotte Moore",
      "street": "36 Marylebone High Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1U 4QE",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-09T08:40:00Z"),
    "last_modified": ISODate("2025-05-16T08:40:00Z")
  },
  {
    "order_id": 188,
    "user_id": 20,
    "user": "Joseph Rodriguez",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("10.99"),
    "shipping_address": {
      "recipient_name": "Joseph Rodriguez",
      "street": "12 Dover Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1S 4LQ",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-11T15:15:45Z"),
    "last_modified": ISODate("2025-05-18T15:15:45Z")
  },
  {
    "order_id": 189,
    "user_id": 17,
    "user": "Emily Thompson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 104,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.30")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("12.69"),
    "shipping_address": {
      "recipient_name": "Emily Thompson",
      "street": "22 Mount Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 2RD",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-13T10:50:30Z"),
    "last_modified": ISODate("2025-05-20T10:50:30Z")
  },
  {
    "order_id": 190,
    "user_id": 6,
    "user": "Olivia Williams",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("2.15")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("9.84"),
    "shipping_address": {
      "recipient_name": "Olivia Williams",
      "street": "40 Sloane Street",
      "city": "London",
      "state": "England",
      "zip_code": "SW1X 9LT",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-15T14:25:15Z"),
    "last_modified": ISODate("2025-05-22T14:25:15Z")
  },
  {
    "order_id": 191,
    "user_id": 14,
    "user": "Charlotte Thomas",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 103,
      "quantity": 1,
      "unit_price": NumberDecimal("10.99"),
      "discount_amount": NumberDecimal("2.20")
    },
    "status": "delivered",
    "total_amount": NumberDecimal("8.79"),
    "shipping_address": {
      "recipient_name": "Charlotte Thomas",
      "street": "17 Pall Mall",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 5LA",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-15T18:05:15Z"),
    "last_modified": ISODate("2025-05-22T10:05:15Z")
  },
  {
    "order_id": 192,
    "user_id": 7,
    "user": "James Johnson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 201,
      "quantity": 1,
      "unit_price": NumberDecimal("24.99"),
      "discount_amount": NumberDecimal("4.60")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("20.39"),
    "shipping_address": {
      "recipient_name": "James Johnson",
      "street": "17 Fleet Street",
      "city": "London",
      "state": "England",
      "zip_code": "EC4Y 1AA",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-17T11:00:00Z"),
    "last_modified": ISODate("2025-05-20T11:00:00Z")
  },
  {
    "order_id": 193,
    "user_id": 15,
    "user": "Daniel White",
    "item": {
      "item_id": 1,
      "variant_id": 5,
      "product_id": 202,
      "quantity": 1,
      "unit_price": NumberDecimal("14.99"),
      "discount_amount": NumberDecimal("2.75")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("12.24"),
    "shipping_address": {
      "recipient_name": "Daniel White",
      "street": "12 Haymarket",
      "city": "London",
      "state": "England",
      "zip_code": "SW1Y 4DQ",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-17T14:35:45Z"),
    "last_modified": ISODate("2025-05-20T14:35:45Z")
  },
  {
    "order_id": 194,
    "user_id": 13,
    "user": "Thomas Anderson",
    "item": {
      "item_id": 1,
      "variant_id": 4,
      "product_id": 102,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Thomas Anderson",
      "street": "9 The Strand",
      "city": "London",
      "state": "England",
      "zip_code": "WC2N 5HR",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-17T16:30:30Z"),
    "last_modified": ISODate("2025-05-20T16:30:30Z")
  },
  {
    "order_id": 195,
    "user_id": 18,
    "user": "Andrew Robinson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 203,
      "quantity": 2,
      "unit_price": NumberDecimal("9.99"),
      "discount_amount": NumberDecimal("1.80")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("18.18"),
    "shipping_address": {
      "recipient_name": "Andrew Robinson",
      "street": "14 Park Lane",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 7AN",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-18T09:10:30Z"),
    "last_modified": ISODate("2025-05-21T09:10:30Z")
  },
  {
    "order_id": 196,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 204,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("4.30")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("15.69"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-18T12:45:15Z"),
    "last_modified": ISODate("2025-05-21T12:45:15Z")
  },
  {
    "order_id": 197,
    "user_id": 18,
    "user": "Andrew Robinson",
    "item": {
      "item_id": 1,
      "variant_id": 6,
      "product_id": 104,
      "quantity": 2,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.75")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("28.23"),
    "shipping_address": {
      "recipient_name": "Grace Robinson",
      "street": "21 South Audley Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1K 2PW",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-18T13:40:00Z"),
    "last_modified": ISODate("2025-05-21T13:40:00Z")
  },
  {
    "order_id": 198,
    "user_id": 10,
    "user": "Amelia Wilson",
    "item": {
      "item_id": 1,
      "variant_id": 2,
      "product_id": 205,
      "quantity": 1,
      "unit_price": NumberDecimal("19.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("19.99"),
    "shipping_address": {
      "recipient_name": "Amelia Wilson",
      "street": "14 Oxford Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1D 1AS",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-18T14:20:00Z"),
    "last_modified": ISODate("2025-05-21T08:20:00Z")
  },
  {
    "order_id": 199,
    "user_id": 20,
    "user": "Joseph Rodriguez",
    "item": {
      "item_id": 1,
      "variant_id": 1,
      "product_id": 105,
      "quantity": 1,
      "unit_price": NumberDecimal("11.99"),
      "discount_amount": NumberDecimal("0.00")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("11.99"),
    "shipping_address": {
      "recipient_name": "Mia Rodriguez",
      "street": "18 Grafton Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1S 4ER",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-19T09:15:45Z"),
    "last_modified": ISODate("2025-05-22T09:15:45Z")
  },
  {
    "order_id": 200,
    "user_id": 20,
    "user": "Joseph Rodriguez",
    "item": {
      "item_id": 1,
      "variant_id": 3,
      "product_id": 101,
      "quantity": 1,
      "unit_price": NumberDecimal("15.99"),
      "discount_amount": NumberDecimal("3.25")
    },
    "status": "shipped",
    "total_amount": NumberDecimal("12.74"),
    "shipping_address": {
      "recipient_name": "Joseph Rodriguez",
      "street": "12 Dover Street",
      "city": "London",
      "state": "England",
      "zip_code": "W1S 4LQ",
      "country": "UK"
    },
    "created_at": ISODate("2025-05-19T11:55:45Z"),
    "last_modified": ISODate("2025-05-22T11:55:45Z")
  }
]);
