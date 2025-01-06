const { ethers } = require("ethers");
const { Interface } = require("ethers");

const { Transaction, secp256k1 } = require("thor-devkit");
const bent = require("bent");

const { address, abi } = require("../helper/contract.js");

async function createTransaction(req, res) {
  const { name, location, certifications, isActive } = req.body;

  // Thiết lập engine gọi http request để giao tiếp với Vechaine
  const get = bent("GET", "https://node-testnet.vechain.energy", "json");
  const post = bent("POST", "https://node-testnet.vechain.energy", "json");
  const getSponsorship = bent(
    "POST",
    "https://sponsor-testnet.vechain.energy",
    "json"
  );

  // Tạo một ví ngẫu nhiên hoặc có thể sử dụng ví của server
  // hoặc sử dụng  ví của người dùng (tùy use case phát triển)
  const wallet = ethers.Wallet.createRandom(); // Tìm cách thay thế máy chủ hiện tại *******

  // Tạo nên engine gọi hàm của smart contract
  // Tạo interface từ abi của smart contract
  const Counter = ethers.utils.Interface(abi);
  // Tạo clause để gọi hàm increment của smart contract (Tạo nội dung của cuộc "giao dịch" )
  const clauses = [
    {
      to: address, // Địa chỉ của smart contract
      value: "0x0", // Giá trị đầu của địa chỉ
      data: Counter.encodeFunctionData("registerFarm", [
        // Dữ liệu gọi hàm của smart contract
        wallet.address,
        name,
        location,
        certifications.split(",").map((cert) => cert.toString().trim()),
      ]),
    },
  ];
  // Lấy thông tin block mới nhất và block genesis
  const bestBlock = await get("/blocks/best"); // Lấy thông tin của block mới nhất trên mạng testnet của Vechain
  const genesisBlock = await get("/blocks/0"); // Lấy thông tin của block đầu tiên trên mạng testnet của Vechain

  // Tạo một instance transaction dựa trên bestblock, genesisblock và clause
  const transaction = new Transaction({
    chainTag: Number.parseInt(genesisBlock.id.slice(-2), 16),
    //chainTag là mã xác định mạng lưới mà giao dịch sẽ được thực hiện. Ở đây xác định mạng lưới testnet của Vechain thông
    //qua 2 số cuối của mã xác định của block genesis (block đầu tiên của mạng lưới testnet của Vechain)
    blockRef: bestBlock.id.slice(0, 18),
    //blockRef tham chiểu đến block mới nhất của mạng lưới testnet của Vechain
    //mục đích của blockRef là đảm bảo rằng giao dịch được thực hiện dựa trên trạng thái hiện tại của blockchain.
    expiration: 32,
    //expiration xác định số lượng block mà giao dịch có thể tồn tại trước khi hết hạn.
    clauses,
    //clauses là danh sách các nội dung, hành động sẽ được thực hiện trong giao dịch.
    gas: bestBlock.gasLimit,
    //gas xác định mức tiêu thụ tài nguyên tối đa cho giao dịch. Ở đây giới hạn trong block mới nhất
    gasPriceCoef: 0,
    //gasPriceCoef là hệ số giá gas (gas price coefficient).
    dependsOn: null,
    //dependsOn chỉ định ID của một giao dịch khác mà giao dịch hiện tại phụ thuộc vào.
    nonce: Date.now(),
    //nonce là một số duy nhất để đảm bảo mỗi giao dịch chỉ được gửi một lần.
    //Ở đây, giá trị nonce được tạo dựa trên thời gian hiện tại (Date.now()
    reserved: {
      //reserved là trường dành riêng cho các tính năng đặc biệt trong tương lai.
      //Giá trị 1 kích hoạt các tính năng nâng cao (như giao dịch ủy quyền).
      features: 1,
    },
  });

  // Kiểm tra xem giao dịch có thể thực hiện hay không
  const tests = await post("/accounts/*", {
    // Đây là API kiểm tra giao dịch có thể thực hiện hay không (Không thực hiện giao dịch)
    clauses: transaction.body.clauses, //clauses là danh sách các nội dung, hành động sẽ được thực hiện trong giao dịch.
    caller: wallet.address, // là địa chỉ ví của người dùng. Ở đây là máy chủ server
    gas: transaction.body.gas, // là phí gas cần trả (được tính toán bằng instance transaction)
  });
  //tests sẽ là nội dung bộ kiểm tra để kiểm tra xem giao dịch có thể thực hiện hay không
  // Kiểm tra xem giao dịch có bị revert hay không trong bộ tests đã kiểm tra
  for (const test of tests) {
    if (test.reverted) {
      //test.reverted là trạng thái từ chối giao dịch.
      const revertReason =
        test.data.length > 10
          ? ethers.AbiCoder.defaultAbiCoder().decode(
              ["string"],
              `0x${test.data.slice(10)}`
            )
          : test.vmError; // giải mã lỗi từ chối giao dịch
      throw new Error(revertReason);
    }
  }

  const { signature } = await getSponsorship("/by/819", {
    //Đây là API lấy chữ kí của "nhà tài trợ" cho giao dịch.
    //Ở đây là máy chủ server của dự án
    origin: wallet.address, // thay bằng ví của người dùng. Ở đây có thể thay thế ví của máy chủ để quản lí giao dịch.
    raw: `0x${transaction.encode().toString("hex")}`, // Giao dịch đã mã hóa. Bản giao dịch sẽ được gửi đến cho "nhà tài trợ" ký
  });
  //signature là chữ kí phản hồi từ nhà tài trợ cho giao dịch.

  const sponsorSignature = Buffer.from(signature.substr(2), "hex"); //Chuyển đổi chữ kí từ hex sang buffer

  // Tạo chữ kí nngười dùng. Ở đây là máy chủ hiện tại.
  const signingHash = transaction.signingHash(); // Lấy mã hash của giao dịch. mã hash này sẽ được làm nhiên liệu để sinh chữ kí của người dùng.
  // Lấy chữ kí từ người dùng.
  const originSignature = secp256k1.sign(
    signingHash, // Mã hash của giao dịch
    Buffer.from(wallet.privateKey.slice(2), "hex") // chuyển đổi key wallet người dùng. Ở đây là máy chủ server từ hex sang buffer
  );
  //originSignature là chữ kí người dùng đồng ý giao dịch.

  //kết hợp chữ kí người dùng và chữ kí nhà tài trợ. Phí gas sẽ là nhà tài trợ chịu trách nhiệm. Người kí là người chứng thực giao dịch.
  transaction.signature = Buffer.concat([originSignature, sponsorSignature]);
  //transaction.signature là chữ kí cuối cùng của giao dịch. Được tạo từ chữ kí của người dùng và chữ kí của nhà tài trợ.

  // Gửi giao dịch lên mạng testnet của Vechain
  const rawTransaction = `0x${transaction.encode().toString("hex")}`;
  const { id } = await post("/transactions", { raw: rawTransaction });
  console.log("Submitted with txId", id);

  return {
    success: 200,
    message: "Transaction submitted",
    txId: id,
  };
}
module.exports = { createTransaction };
