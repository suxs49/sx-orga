// Stated Script //

document.getElementById("memberForm").addEventListener("submit", addMembers);

function addMembers(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = event.target;
    var name = form.elements["name"].value;
    var mobileNumber = form.elements["mobileNumber"].value;
    var nidNumber = form.elements["nidNumber"].value;
    var privateKey = form.elements["privateKey"].value;

    var url = "https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.replit.dev/add/new";
    url += "?name=" + encodeURIComponent(name);
    url += "&mobileNumber=" + encodeURIComponent(mobileNumber);
    url += "&nidNumber=" + encodeURIComponent(nidNumber);
    url += "&privateKey=" + encodeURIComponent(privateKey);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const nami = data.member.name;
            const seri = data.member.serialNumber;
            document.getElementById("apiResponse").innerText = `Successfully Added New Members \nName :${nami}\nSerial : ${seri}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
//////
function addBalance(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = document.getElementById("memberForm");
    var serialNumber = form.elements["serialNumber"].value;
    var amount = form.elements["amount"].value;
    var privateKey = form.elements["privateKey"].value;

    var url = "https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.replit.dev/addbalance";
    url += "?serialNumber=" + encodeURIComponent(serialNumber);
    url +="&amount=" + encodeURIComponent(amount);
    url +="&privateKey=" + encodeURIComponent(privateKey);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const nami = data.member.name;
            const bala = data.member.balance;
            document.getElementById("apiResponse").innerText = `Successfully Added Balance 🔥\nName: ${nami}\nAdd Balance : ৳${encodeURIComponent(amount)}\n${nami} Total Balance ৳${bala}\n`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
/////
function searchMember(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = document.getElementById("memberForm");
    var serialNumber = form.elements["serialNumber"].value;
    var privateKey = form.elements["privateKey"].value;

    var url = "https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.replit.dev/";
    url += "search/" + encodeURIComponent(serialNumber);
    url += "?privateKey=" + encodeURIComponent(privateKey);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const nami = data.member.name;
            const nidi = data.member.nidNumber;
            const mobil = data.member.mobileNumber;
            document.getElementById("apiResponse").innerText = `Members Name: ${nami} \n NID Number: ${nidi} \n Mobile Number: ${mobil}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
/////
function memberBalance(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = document.getElementById("memberForm");
    var serialNumber = form.elements["serialNumber"].value;
   var privateKey = form.elements["privateKey"].value;

    var url = "https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.replit.dev/";
    url += "balance/" + encodeURIComponent(serialNumber);
    url += "?privateKey=" + encodeURIComponent(privateKey);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const nami = data.member.name;
            const bala = data.member.balance;
          const result = `Name: ${nami} \nBalance: ${bala}`;
            document.getElementById("apiResponse").innerText = `${result}`;
        
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
//
function nameUpdate(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = document.getElementById("memberForm");
    var serialNumber = form.elements["serialNumber"].value;
    var newName = form.elements["newName"].value;
   var privateKey = form.elements["privateKey"].value;

    var url = "https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.replit.dev/update/";
    url += "name/" + encodeURIComponent(serialNumber);
    url += "?newName=" + encodeURIComponent(newName);
    url += "&privateKey=" + encodeURIComponent(privateKey);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            
          const result = `succesfully updated name`;
            document.getElementById("apiResponse").innerText = `${result}`;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
/////
function removeMember(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = document.getElementById("memberForm");
    var name = form.elements["name"].value;
    var serialNumber = form.elements["serialNumber"].value; 
    var privateKey = form.elements["privateKey"].value;

    var url = `https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.repl.co/remove?name=${encodeURIComponent(name)}&serialNumber=${encodeURIComponent(serialNumber)}&privateKey=${encodeURIComponent(privateKey)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = data.message;
            document.getElementById("apiResponse").innerText = result; // Display success message
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("apiResponse").innerText = 'Error'; // Display error message
        });
}
////
function readdMembers(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = event.target;
    var name = form.elements["name"].value;
    var mobileNumber = form.elements["mobileNumber"].value;
    var nidNumber = form.elements["nidNumber"].value;
    var serialNumber = form.elements["nidNumber"].value;
    var privateKey = form.elements["privateKey"].value;

    var url = "https://85ac9d21-6ff2-4774-ab3d-6fb355bfe970-00-2xg86u8n2ze6c.pike.replit.dev/readd";
    url += "?name=" + encodeURIComponent(name);
    url += "&mobileNumber=" + encodeURIComponent(mobileNumber);
    url += "&nidNumber=" + encodeURIComponent(nidNumber);
  url += "&serialNumber=" + encodeURIComponent(serialNumber);
    url += "&privateKey=" + encodeURIComponent(privateKey);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const nami = data.member.name;
            const seri = data.member.serialNumber;
            document.getElementById("apiResponse").innerText = `Successfully Added New Members \nName :${nami}\nSerial : ${seri}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}