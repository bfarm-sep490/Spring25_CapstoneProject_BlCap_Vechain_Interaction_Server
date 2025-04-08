const CryptoJS = require("crypto-js");

const { abi, bytecode } = require("../models/farm-contract.js");
const {
  ThorClient,
  VeChainProvider,
  ProviderInternalBaseWallet,
  signerUtils,
} = require("@vechain/sdk-network");

const {
  ABIFunction,
  Address,
  Clause,
  ABIContract,
  HexUInt,
  Secp256k1,
  Transaction,
} = require("@vechain/sdk-core");

const thor = ThorClient.at("https://testnet.vechain.org/");
const senderPrivateKey =
  "daecfa21e37149ec2b37bea923adbbc2cbba8f8db8dca9b7fe52fcb4b31ad630";
const senderAddress = Address.ofPrivateKey(senderPrivateKey).toString();

const provider = new VeChainProvider(
  thor,
  new ProviderInternalBaseWallet(
    [
      {
        privateKey: senderPrivateKey,
        address: senderAddress,
      },
    ],
    {
      gasPayer: {
        gasPayerServiceUrl: `https://sponsor-testnet.vechain.energy/by/819`,
      },
    }
  ),
  true // fee delegation enabled
);
const contractAddress = "0xca8c538523cac1e6eddc5b5b912eb6e00a7cd683";
// Tự deploy contract bằng code (Thông thường cái này sẽ là web3)
async function deployAPlanContract(req, res) {
  try {
    // Địa chỉ ví của người dùng (có thể là ví của máy chủ hoặc ví của người dùng)
    // Ở đây là ví của máy chủ server
    const privateKey =
      "daecfa21e37149ec2b37bea923adbbc2cbba8f8db8dca9b7fe52fcb4b31ad630";

    const address = Address.ofPrivateKey(senderPrivateKey).toString();
    // Tạo một instance của VeChainProvider và ThorClient (Đây là thư viện SDK của VeChain)
    const thorClient = ThorClient.at("https://testnet.vechain.org/"); // Thay bằng URL cho testnet hoặc mainnet
    // Đây là account của developer deploy
    const deployerAccount = {
      privateKey: privateKey,
      address: address,
    };
    // Đây là account người proxy máy chủ
    const proxyAccount = {
      privateKey: privateKey,
      address: address,
    };
    // Đây là account owner của contract (có thể là ví của người dùng hoặc ví của máy chủ)
    const owner = {
      privateKey: privateKey,
      address: address,
    };
    // Ở đây ta tạo 3 địa chỉ này cùng 1 chỗ vì chúng ta tự deploy contract và proxy cho đồ án (ở đây là máy chủ server)
    const provider = new VeChainProvider(
      thorClient,
      new ProviderInternalBaseWallet([deployerAccount, proxyAccount, owner], {
        gasPayer: {
          gasPayerServiceUrl: "https://sponsor-testnet.vechain.energy/by/819",
          // Địa chỉ của nhà tài trợ gas (ở đây là máy chủ server)
        },
      }),
      true
    );
    // Lấy người ký hợp đồng tạo contract (ở đây là máy chủ server)
    const signer = await provider.getSigner(deployerAccount.address);

    const setupERC20Contract = async () => {
      // Tạo một instance của contract factory với ABI và bytecode của hợp đồng ERC20
      // Tạo contract factory từ abi và bytecode của smart contract
      const contractFactory = thorClient.contracts.createContractFactory(
        abi, // ABI của smart contract (dạng interface của smart contract)
        bytecode, // bytecode của smart contract (dạng mã nhị phân của smart contract)
        signer // Địa chỉ của người ký hợp đồng (ở đây là máy chủ server)
      );

      // Bắt đầu triển khai hợp đồng
      await contractFactory.startDeployment();

      // Đợi cho đến khi hợp đồng được triển khai
      return await contractFactory.waitForDeployment();
    };

    // Triển khai hợp đồng ERC20 và lấy địa chỉ hợp đồng
    const contract = await setupERC20Contract();
    return {
      status: 200,
      message: "Contract deployed successfully",
      contractAddress: contract.address, // Địa chỉ của hợp đồng sau khi triển khai
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      error: error.message,
    };
  }
}

const createdPlan = async (req, res) => {
  try {
    const { status, messsage, contractAddress } = await deployAPlanContract(
      req,
      res
    );

    const {
      _planId,
      _plantId,
      _yieldId,
      _expertId,
      _planName,
      _startDate,
      _endDate,
      _estimatedProduct,
      _estimatedUnit,
      _status,
    } = req.body;

    const clause = Clause.callFunction(
      Address.of(contractAddress),
      ABIContract.ofAbi(abi).getFunction("createPlan"),
      [
        _planId,
        _plantId,
        _yieldId,
        _expertId,
        _planName,
        _startDate,
        _endDate,
        _estimatedProduct,
        _estimatedUnit,
        _status,
      ]
    );

    // ⛽ Estimate gas
    const gas = await thor.gas.estimateGas([clause]);

    // 🧱 Build tx (trả về đúng format TransactionRequestInput)
    const txBody = await thor.transactions.buildTransactionBody(
      [clause],
      gas.totalGas,
      {
        isDelegated: true,
      }
    );

    // ✍️ Sign transaction
    const signer = await provider.getSigner(senderAddress);
    const rawSignedTx = await signer.signTransaction(txBody);

    const signedTx = Transaction.decode(HexUInt.of(rawSignedTx).bytes, true);
    console.log(signedTx);

    const sendTransactionResult = await thor.transactions.sendTransaction(
      signedTx
    );

    const txReceipt = await thor.transactions.waitForTransaction(
      sendTransactionResult.id
    );
    console.log("✅ Transaction sent:", txReceipt);

    return {
      status: 200,
      message: "Transaction created successfully",
      data: {
        contractAddress: contractAddress,
        txReceipt: txReceipt,
      },
    };
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
    return {
      status: 500,
      message: "Transaction failed",
      error: error.message,
    };
  }
};

const createdTask = async (req, res) => {
  try {
    const { _taskId, _taskType, _status, _data } = req.body;
    const { contractAddress } = req.params;
    const clause = Clause.callFunction(
      Address.of(contractAddress),
      ABIContract.ofAbi(abi).getFunction("addTaskMilestone"),
      [_taskId, _taskType, _status, _data]
    );

    // ⛽ Estimate gas
    const gas = await thor.gas.estimateGas([clause]);

    // 🧱 Build tx (trả về đúng format TransactionRequestInput)
    const txBody = await thor.transactions.buildTransactionBody(
      [clause],
      gas.totalGas,
      {
        isDelegated: true,
      }
    );

    // ✍️ Sign transaction
    const signer = await provider.getSigner(senderAddress);
    const rawSignedTx = await signer.signTransaction(txBody);

    const signedTx = Transaction.decode(HexUInt.of(rawSignedTx).bytes, true);
    console.log(signedTx);

    const sendTransactionResult = await thor.transactions.sendTransaction(
      signedTx
    );

    const txReceipt = await thor.transactions.waitForTransaction(
      sendTransactionResult.id
    );
    console.log("✅ Transaction sent:", txReceipt);

    return {
      status: 200,
      message: "Transaction created successfully",
      data: txReceipt,
    };
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
    return {
      status: 500,
      message: "Transaction failed",
      error: error.message,
    };
  }
};
const createdInspect = async (req, res) => {
  try {
    const { _inspectionId, _inspectionType, _data} = req.body;
    const { contractAddress } = req.params;
    const clause = Clause.callFunction(
      Address.of(contractAddress),
      ABIContract.ofAbi(abi).getFunction("addInspectionMilestone"),
      [_inspectionId, _inspectionType, _data]
    );

    // ⛽ Estimate gas
    const gas = await thor.gas.estimateGas([clause]);

    // 🧱 Build tx (trả về đúng format TransactionRequestInput)
    const txBody = await thor.transactions.buildTransactionBody(
      [clause],
      gas.totalGas,
      {
        isDelegated: true,
      }
    );

    // ✍️ Sign transaction
    const signer = await provider.getSigner(senderAddress);
    const rawSignedTx = await signer.signTransaction(txBody);

    const signedTx = Transaction.decode(HexUInt.of(rawSignedTx).bytes, true);
    console.log(signedTx);

    const sendTransactionResult = await thor.transactions.sendTransaction(
      signedTx
    );

    const txReceipt = await thor.transactions.waitForTransaction(
      sendTransactionResult.id
    );
    console.log("✅ Transaction sent:", txReceipt);

    return {
      status: 200,
      message: "Transaction created successfully",
      data: txReceipt,
    };
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
    return {
      status: 500,
      message: "Transaction failed",
      error: error.message,
    };
  }
};
const getContractTransactions = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const planInfo = await thor.contracts.executeCall(
      contractAddress,
      ABIContract.ofAbi(abi).getFunction("getPlanInfo"),
      []
    );
    console.log("planInfo", planInfo.result.plain?.[0]);
    return {
      status: 200,
      message: "Fetched Plans successfully",
      data: formatPlanInfo(planInfo.result.plain),
    };
  } catch (err) {
    console.error("Error fetching events:", err);
    return {
      status: 500,
      message: "Error fetching events",
      error: err.message,
    };
  }
};

function formatPlanInfo(planInfo) {
  if (!Array.isArray(planInfo) || planInfo.length !== 3) {
    throw new Error("Invalid planInfo structure");
  }

  const [planData, taskList, inspectionList] = planInfo;

  return {
    plan: {
      planId: Number(planData.planId),
      plantId: Number(planData.plantId),
      yieldId: Number(planData.yieldId),
      expertId: Number(planData.expertId),
      planName: planData.planName,
      startDate: Number(planData.startDate),
      endDate: Number(planData.endDate),
      estimatedProduct: Number(planData.estimatedProduct),
      estimatedUnit: planData.estimatedUnit,
      status: planData.status,
    },
    taskMilestones: taskList.map((task) => ({
      taskId: Number(task.taskId),
      taskType: task.taskType,
      timestamp: Number(task.timestamp),
      status: task.status,
      data: task?.data,
    })),
    inspectionMilestones: inspectionList.map((inspection) => ({
      inspectionId: Number(inspection.inspectionId),
      timestamp: Number(inspection.timestamp),
      inspectionType: Number(inspection.inspectionType),
      data: inspection?.data,
    })),
  };
}

module.exports = {
  createdPlan,
  createdTask,
  getContractTransactions,
  createdInspect
};
