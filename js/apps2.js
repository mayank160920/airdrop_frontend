let web3 ;
let default_account;
let my_contract;

const contract_address = "0xFBb53fFb09877e88fC16dbcDD495CE15B399E8EC";
const contract_abi = [{"inputs": [{"internalType": "address","name": "referral_address","type": "address"}],"name": "claim_airdrop","outputs": [],"stateMutability": "payable","type": "function"}]

const loadweb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
      web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();

          web3.eth.getAccounts(function(err, accounts){ 
            console.log(err,accounts);
            if(!err){
              default_account = accounts[0];
              console.log('Metamask account is: ' + accounts[0]);
            }           
          })

      } catch (error) {
          // User denied account access...
      }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      web3 = new Web3(web3.currentProvider);

      web3.eth.getAccounts(function(err, accounts){ 
        console.log(err,accounts);
        default_account = accounts[0];
        if(!err){
          console.log('Your Metamask account is: ' + accounts[0]);
        }           
      })
  }
  // Non-dapp browsers...
  else {
    alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

const getAirdrop = async () => {
  await loadweb3();
  const chainId = await web3.eth.getChainId();
  
  if (chainId !== 56) {
    alert('Please Select BSC Network in Your Wallet');
    return
  } else {
    console.log (' Right Network :)')
  }

  contract = new web3.eth.Contract(contract_abi,contract_address);
  
  let referral_address = new URL(window.location.href).searchParams.get('r');
  try {
    if (referral_address) {
      console.log( `referred by : ${referral_address}` )
      referral_address = web3.utils.toChecksumAddress(referral_address);
    } else {
      referral_address = '0x000000000000000000000000000000000000dead'
    }
  } catch (error){
    console.log(error.message);
    alert ('Referral Address Not Valid !');
  }

  txn = contract.methods.claim_airdrop(referral_address).send({from : default_account, value: 0.002 * (10**18)});
  txn.on('receipt', function(receipt) {
    if (receipt.status == true){
      alert('Airdrop Claimed !')
    }
  })
  txn.on('error', function(error){ 
    if (error.code == 4001) {
      alert(`Error : ${error.message}`);
      return
    }
    console.log(error);
    alert(`Error : ${error.message}`)
  })

};

function getreflink() {
  let link = window.location.href;
  addr = document.getElementById('refaddress').value
  if (!addr) {
    alert('Please Enter Your Address !');
    return
  } 
  ref_link = link + '?r=' + addr
  console.log(ref_link);
  document.getElementById('refaddress').value = ref_link;
}

function copyToClipboard(id) {
    var text = document.getElementById(id).value; //getting the text from that particular Row
    //window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
  }