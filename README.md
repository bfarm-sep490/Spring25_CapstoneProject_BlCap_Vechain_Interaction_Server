# BlCap - BFarm Documentation

## DEFINITIONS

### TRANSACTION
- A **Transaction** refers to operations executed via **Smart Contracts**. Each transaction may include multiple terms or conditions, which are represented as functions defined within the Smart Contract.  
- Every transaction requires at least **two signatures** to be valid:  
  - **User's signature**: The individual initiating the transaction.  
  - **Sponsor's signature**: The entity funding and authorizing the transaction.  

- For sponsors:  
  - Contracts must always have the sponsor's approval before execution.  
  - Sponsors are responsible for covering the primary costs of the transaction.  
  - In the BlCap project, the sponsor also acts as the user and software developer.  

### SMART CONTRACT
- A **Smart Contract** is a piece of code that automatically executes on the blockchain once predefined conditions are met. Smart Contracts enable secure, autonomous, and decentralized execution of transactions without requiring third-party intervention.  

- Example from the project:
  - Smart Contracts are defined in the `"account-abstraction-contracts/contracts"` directory.  

- **Structure**:
  - Each contract includes fields and functions, where functions are only activated when triggered through transactions.  

- **Example**:
  - The file `"farm-controller.js"` is responsible for handling the creation of a transaction for the `"registerFarm"` function in the **"FarmRegistry"** Smart Contract.  

### BLOCK
- A **Block** is a collection of transactions recorded and linked together within the blockchain. Each block contains:  
  - **Transaction data**  
  - A unique **hash** for the block itself  
  - The **hash of the previous block** to establish a secure chain of linked data.  

- A block may contain multiple transactions.  
- The creation of blocks to execute transactions is managed by platform developers.  

### CHAIN
- A **Chain** refers to the linked structure of blocks in a blockchain.  
- Each block is connected sequentially via cryptographic hashes, forming a tamper-proof chain that ensures transparency and data security.  

---

## APPLICATION IN THE BlCap - BFarm PROJECT
- Interaction with the VeChain platform is managed by the server-side of the application.  
- This is due to the fact that farmers may lack the knowledge required to register for sponsorship tokens.  

## IMPLEMENTATION STEPS

### Step 1: Create Smart Contract
- Refer to the guide: [Smart Contract Creation Guide](https://github.com/bfarm-sep490/blockchain-vechain)  
### Step 2: Install Dependencies
- Run the following command to install all necessary libraries:  
```shell
npm install
```
### Step 3: Create file .env
The content of .env:
```shell
API_BASE_URL=        # Base URL of the blockchain platform where blocks and transactions are managed
API_SPONSOR_URL=     # Base URL of the sponsor platform
ID_SPONSOR=          # Unique ID of the sponsor
FARM_CONTRACT_ADDRESS= # Address of the Smart Contract deployed on the blockchain
```

