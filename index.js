// Required modules
const express = require('express');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set JSON response formatting
app.set('json spaces', 4);
//
global.home = process.cwd() + '/public/index.html';
global.add = process.cwd() + '/public/add.html';
global.addb = process.cwd() + '/public/addbalance.html';
global.srch = process.cwd() + '/public/search.html';
global.chk = process.cwd() + '/public/checkbl.html';
global.unm = process.cwd() + '/public/name.html';
global.rm = process.cwd() + '/public/remove.html';
global.radd = process.cwd() + '/public/read.html';
global.css = process.cwd() + '/styles.css';
global.js = process.cwd() + '/script.js';

app.get('/', function (request, response) {
    response.sendFile(global.home);
}).listen(app.get('port'));
//
app.get('/adding', function (request, response) {
    response.sendFile(global.add);
}).listen(app.get('port'));
app.get('/adbalance', function (request, response) {
    response.sendFile(global.addb);
}).listen(app.get('port'));
app.get('/searching', function (request, response) {
    response.sendFile(global.srch);
}).listen(app.get('port'));
app.get('/check', function (request, response) {
    response.sendFile(global.chk);
}).listen(app.get('port'));
app.get('/name', function (request, response) {
    response.sendFile(global.unm);
}).listen(app.get('port'));
  app.get('/remov', function (request, response) {
      response.sendFile(global.rm);
  });
app.get('/readding', function (request, response) {
    response.sendFile(global.radd);
});
app.get('/styles.css', function (request, response) {
    response.sendFile(global.css);
});
app.get('/script.js', function (request, response) {
    response.sendFile(global.js);
});
//

// Route to handle root endpoint


// Retrieve member data from database/members.json if available, otherwise initialize an empty array
let membersInfo = JSON.parse(fs.readFileSync('database/members.json', 'utf8')) || [];

// Retrieve member balance data from database/balance.json if available, otherwise initialize an empty array
let members = JSON.parse(fs.readFileSync('database/balance.json', 'utf8')) || [];

// Function to save members' information to database/members.json
function saveMembersInfo() {
    const data = membersInfo.map(member => ({
        serialNumber: member.serialNumber,
        name: member.name,
        mobileNumber: member.mobileNumber,
        nidNumber: member.nidNumber
    }));

    fs.writeFile('database/members.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
        if (err) {
            console.error('Error saving members info:', err);
        } else {
            console.log('Members info saved successfully.');
        }
    });
}

// Function to save member balance data to database/balance.json
function saveMembers() {
    const data = members.map(member => ({
        serialNumber: member.serialNumber,
        name: member.name,
        balance: member.balance
    }));

    fs.writeFile('database/balance.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
        if (err) {
            console.error('Error saving member balance:', err);
        } else {
            console.log('Member balance saved successfully.');
        }
    });
}


// Routes for managing members


app.get('/add/new', (req, res) => {
    const { name, mobileNumber, nidNumber, privateKey } = req.query;

    if (!name || !mobileNumber || !nidNumber || !privateKey) {
        return res.status(400).send('Please enter all required information including private key.');
    }

    // Validate private key - You can implement your own validation logic here
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).send('Invalid private key.');
    }

    // Other validation logic can be added here if needed

    if (membersInfo.some(member => member.name === name)) {
        return res.status(400).send('Member already exists.');
    }

    const serialNumber = membersInfo.length + 1;

    membersInfo.push({ serialNumber, name, mobileNumber, nidNumber });
    saveMembersInfo();

    members.push({ serialNumber, name, balance: 0 });
    saveMembers();

    // Respond with the full member information
    res.send({
        message: 'Member added successfully.',
        member: { serialNumber, name, mobileNumber, nidNumber }
    });
});

// Function to validate private key (example)
function isValidPrivateKey(privateKey) {
    // Example validation logic - replace this with your actual validation logic
    return privateKey === '36';
}

// Route to retrieve a specific member's information by serial number
app.get('/search/:serialNumber', (req, res) => {
    const serialNumber = parseInt(req.params.serialNumber);
    const { privateKey } = req.query;

    // Check if serialNumber and pin are provided
    if ( !privateKey) {
        return res.status(400).send('Serial & pin');
    }

    const member = membersInfo.find(m => m.serialNumber === serialNumber);

    if (member) {
        res.send({
            message: 'Member found:',
            member
        });
    } else {
        res.status(404).send('Member not found.');
    }
});

// Route to collect money from a member by serial number and amount
app.get('/addbalance', (req, res) => {
    const { serialNumber, amount, privateKey } = req.query;

    // Check if serialNumber and amount are provided
    if (!serialNumber || !amount || !privateKey) {
        return res.status(400).send('Please provide both serial number and amount.');
    }

    // Convert serialNumber to integer
    const memberSerialNumber = parseInt(serialNumber);

    // Find the member by serial number
    const memberIndex = members.findIndex(member => member.serialNumber === memberSerialNumber);

    if (memberIndex === -1) {
        return res.status(404).send('Member not found.');
    }

    // Update member's balance
    members[memberIndex].balance += parseFloat(amount);

    // Save the updated member data to database/balance.json
    saveMembers();

    // Respond with the updated member information
    res.json({
        message: 'successfully Added balance .',
        member: members[memberIndex]
    });
});

// Route to retrieve all member information from database/members.json
app.get('/all', (req, res) => {
    // Read the database/members.json file
    fs.readFile('database/members.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading members info:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Parse the JSON data
        const membersInfoData = JSON.parse(data);

        // Respond with the member information
        res.send({
            message: 'All Members Information:',
            members: membersInfoData
        });
    });
});

// Route to retrieve a member's balance by serial number
app.get('/balance/:serialNumber', (req, res) => {
    const { privateKey } = req.query;

    // Validate private key
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).send('Invalid private key.');
    }

    const serialNumber = parseInt(req.params.serialNumber);

    // Find the member by serial number
    const member = members.find(m => m.serialNumber === serialNumber);

    if (member) {
        res.send({
            message: 'Member balance found:',
            member: { name: member.name, balance: member.balance }
        });
    } else {
        res.status(404).send('Member not found.');
    }
});

// Route to update a member's name by serial number
app.get('/update/name/:serialNumber', (req, res) => {
    const serialNumber = parseInt(req.params.serialNumber);
    const { newName, privateKey } = req.query;

    // Check if newName is provided
    if (!newName || !privateKey) {
        return res.status(400).send('Please provide the new name & private key.');
    }

    // Check if the new name already exists
    const existingMember = membersInfo.find(member => member.name === newName);
    if (existingMember) {
        return res.status(400).send(`A member with the name '${newName}' already exists.`);
    }

    // Find the member by serial number in membersInfo array
    const memberIndex = membersInfo.findIndex(member => member.serialNumber === serialNumber);

    if (memberIndex === -1) {
        return res.status(404).send('Member not found.');
    }

    // Find the member by serial number in members array
    const memberBalanceIndex = members.findIndex(member => member.serialNumber === serialNumber);

    if (memberBalanceIndex === -1) {
        return res.status(404).send('Member balance not found.');
    }

    // Update member's name in membersInfo array
    membersInfo[memberIndex].name = newName;

    // Update member's name in members array
    members[memberBalanceIndex].name = newName;

    // Save the updated member data to database/members.json
    saveMembersInfo();

    // Save the updated member data to database/balance.json
    saveMembers();

    // Respond with the updated member information
    res.send({
        message: 'Member name updated successfully.',
        member: membersInfo[memberIndex]
    });
});
// Route to retrieve total balance of all members
app.get('/totalbalance', (req, res) => {
    // Read the balance JSON file
    fs.readFile('database/balance.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading balance file:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            // Parse the JSON data
            const membersData = JSON.parse(data);

            // Calculate the total balance
            let totalBalance = 0;
            membersData.forEach(member => {
                totalBalance += member.balance;
            });

            // Send the total balance as response
            res.send({
                totalBalance: totalBalance
            });
        } catch (error) {
            console.error('Error parsing balance data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
//
app.get('/removeall',  (req, res) => {
  // Read data.json
  fs.readFile('database/balance.json', 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send('Error reading member data.');
      }

      let membersData = [];
      try {
          membersData = JSON.parse(data);
      } catch (parseError) {
          return res.status(500).send('Error parsing member data.');
      }

      // Clear member data
      const filteredMembers = [];

      // Write empty array back to data.json
      fs.writeFile('database/balance.json', JSON.stringify(filteredMembers), 'utf8', (err) => {
          if (err) {
              return res.status(500).send('Error removing member data.');
          }

          // Read membersinfo.json
          fs.readFile('database/members.json', 'utf8', (err, data) => {
              if (err) {
                  return res.status(500).send('Error reading member info data.');
              }

              let membersInfoData = [];
              try {
                  membersInfoData = JSON.parse(data);
              } catch (parseError) {
                  return res.status(500).send('Error parsing member info data.');
              }

              // Clear member info data
              const filteredMembersInfo = [];

              // Write empty array back to membersinfo.json
              fs.writeFile('database/members.json', JSON.stringify(filteredMembersInfo), 'utf8', (err) => {
                  if (err) {
                      return res.status(500).send('Error removing member info data.');
                  }

                  res.send('All member data removed successfully.');
              });
          });
      });
  });
});
//
// Route to read database/members.json line by line, serial by serial
app.get('/data', (req, res) => {
    const { privateKey } = req.query;

    // Validate private key
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).send('Invalid private key.');
    }

    // Read the database/members.json file
    fs.readFile('database/members.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading members info:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            // Parse the JSON data
            const membersInfoData = JSON.parse(data);

            // Iterate over each member and send line by line
            membersInfoData.forEach(member => {
                const line = `Serial Number: ${member.serialNumber}, Name: ${member.name}, Mobile Number: ${member.mobileNumber}, NID Number: ${member.nidNumber}`;
               res.write(line + '\n\n');
            });

            // End the response
            res.end();
        } catch (error) {
            console.error('Error parsing members info data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
//
// Route to read database/balance.json line by line, serial by serial
app.get('/data2', (req, res) => {
    const { privateKey } = req.query;

    // Validate private key
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).send('Invalid private key.');
    }

    // Read the database/balance.json file
    fs.readFile('database/balance.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading balance data:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            // Parse the JSON data
            const balanceData = JSON.parse(data);

            // Iterate over each balance entry and send line by line
            balanceData.forEach(entry => {
                const line = `Serial Number: ${entry.serialNumber}, Name: ${entry.name}, Balance: ${entry.balance}`;
                res.write(line + '\n\n');
            });

            // End the response
            res.end();
        } catch (error) {
            console.error('Error parsing balance data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
////
// Route to remove a member's data
app.get('/remove', (req, res) => {
  const { name, serialNumber, privateKey } = req.query;
  if (!name || !serialNumber || !privateKey) {
    return res.status(400).send('Please provide both name, serial number, and private key of the member to remove.');
  }

  // Find the index of the member in membersInfo array
  const memberIndex = membersInfo.findIndex(member => member.name === name && member.serialNumber === parseInt(serialNumber));

  if (memberIndex === -1) {
    return res.status(404).send('Member not found.');
  }

  // Remove member from membersInfo array
  const removedMember = membersInfo.splice(memberIndex, 1)[0];
  saveMembersInfo();

  // Remove member from members array
  const removedMemberData = members.splice(memberIndex, 1)[0];
  saveMembers();

  // Write a message to indicate the member is removed by server admin
  const removeMessage = `Member ${removedMember.name} with serial number ${removedMember.serialNumber} is removed by server admin.`;
  fs.appendFileSync('removed_members.txt', removeMessage + '\n');

  res.json({
    message: 'Member removed successfully.'
  });
});
////
// Route to re-add members with original serial numbers and update member information
app.get('/readd', (req, res) => {
    const { name, mobileNumber, nidNumber, serialNumber, privateKey } = req.query;

    // Check if all required fields are provided
    if (!name || !mobileNumber || !nidNumber || !serialNumber || !privateKey) {
        return res.status(400).json({ error: 'Please provide name, mobile number, NID number, serial number, and private key.' });
    }

    // Validate private key
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).json({ error: 'Invalid private key.' });
    }

    // Check if the provided serial number already exists
    if (membersInfo.some(member => member.serialNumber === parseInt(serialNumber))) {
        return res.status(400).json({ error: 'Serial number already exists.' });
    }

    // Find the index of the member to be re-added in membersInfo array
    const memberIndex = parseInt(serialNumber) - 1;

    // Re-add the member at the specified serial number position
    membersInfo.splice(memberIndex, 0, { serialNumber: parseInt(serialNumber), name, mobileNumber, nidNumber });
    saveMembersInfo();

    // Re-add the member at the specified serial number position in members array
    members.splice(memberIndex, 0, { serialNumber: parseInt(serialNumber), name, balance: 0 });
    saveMembers();

    res.json({ message: 'Member re-added successfully.' });
});
///
// Route to read database/members.json line by line, serial by serial
app.get('/data/member', (req, res) => {
    const { privateKey } = req.query;

    // Validate private key
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).json({ error: 'Invalid private key.' });
    }

    // Read the database/members.json file
    fs.readFile('database/members.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading members info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            // Parse the JSON data
            const membersInfoData = JSON.parse(data);

            // Prepare object to hold member information
            const memberObj = {};

            // Iterate over each member and collect data
            membersInfoData.forEach((member, index) => {
                const memberKey = `member[${index}]`;
                memberObj[memberKey] = {
                    'Serial Number': member.serialNumber,
                    'Name': member.name,
                    'Mobile Number': member.mobileNumber,
                    'NID Number': member.nidNumber
                };
            });

            // Send the object of member information as JSON response
            res.json({ Members: memberObj });
        } catch (error) {
            console.error('Error parsing members info data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});
////
// Route to read database/balance.json line by line, serial by serial
app.get('/data/balance', (req, res) => {
    const { privateKey } = req.query;

    // Validate private key
    if (!isValidPrivateKey(privateKey)) {
        return res.status(401).json({ error: 'Invalid private key.' });
    }

    // Read the database/balance.json file
    fs.readFile('database/balance.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading balance data:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            // Parse the JSON data
            const balanceData = JSON.parse(data);

            // Prepare object to hold member information
            const memberObj = {};

            // Iterate over each balance entry and collect data
            balanceData.forEach((entry, index) => {
                const memberKey = `member[${index}]`;
                memberObj[memberKey] = {
                    'Serial Number': entry.serialNumber,
                    'Name': entry.name,
                    'Balance': entry.balance
                };
            });

            // Send the object of balance information as JSON response
            res.json({ Members: memberObj });
        } catch (error) {
            console.error('Error parsing balance data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
