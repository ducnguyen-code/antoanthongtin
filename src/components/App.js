import React, { Component } from "react";
import coupon from "../coupons.png";
import "./App.css";
import Web3 from "web3";
import DaiTokenMock from "../abis/DaiTokenMock.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    var qrcode = new window.QRCode("id_qrcode", {
      text: this.state.account,
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log("App -> loadBlockchainData -> accounts", accounts);
    this.setState({ account: accounts[0] });
    const daiTokenAddress = "0xffcF3417a8b533BDc0c6812934860f8Bee159C6b"; // Get address form abis/DaiTokenMock.json line 1221 and paste here
    const daiTokenMock = new web3.eth.Contract(
      DaiTokenMock.abi,
      daiTokenAddress
    );
    this.setState({ daiTokenMock: daiTokenMock });
    const balance = await daiTokenMock.methods
      .balanceOf(this.state.account)
      .call();
    console.log("App -> loadBlockchainData -> balance", balance);
    // eslint-disable-next-line no-unused-expressions
    balance
      ? this.setState({
        balance: web3.utils.fromWei(balance.toString(), "Ether"),
      })
      : null;
    const transactions = await daiTokenMock.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      filter: { from: this.state.account },
    });
    this.setState({ transactions: transactions });
  }

  transfer(recipient, amount) {
    this.state.daiTokenMock.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account });
  }

  constructor(props) {
    super(props);
    this.state = {
      closeQR: false,
      account: "",
      daiTokenMock: null,
      balance: 0,
      transactions: [],
    };

    this.transfer = this.transfer.bind(this);
  }

  openCamera() {
    document.getElementById("reader").style.display = "block";
    var html5QrcodeScanner = new window.Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });
    window.html5QrcodeScanner = html5QrcodeScanner;
    html5QrcodeScanner.render((mess) => {
      this.onScanSuccess(mess, html5QrcodeScanner);
    });
  }

  onScanSuccess(qrCodeMessage, scanner) {
    document.getElementById("recipient").value = qrCodeMessage;
    console.log(qrCodeMessage);
    document.getElementById("reader").style.display = "none";
    scanner.html5Qrcode
      .stop()
      .then((ignore) => {
        console.log("stopped");
      })
      .catch((err) => {
        console.log("err");
      });
  }

  openQR() {
    document.getElementById("wrapper").style["margin-left"] = "-100vw";
    console.log(this.state.account);
  }

  closeQR() {
    document.getElementById("wrapper").style["margin-left"] = "0vw";
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="">
            Giao Dịch Đổi Thưởng
          </a>
        </nav>
        <div className="container-fluid mt-5" id="wrapper">
          <div className="row fl-left">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ width: "500px" }}
              >
                <a href="">
                  <img src={coupon} width="350" alt="" />
                </a>
                <button
                  className="btn btn-secondary my-qr"
                  onClick={() => {
                    this.openQR();
                  }}
                >
                  My QR
                </button>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const recipient = (this.recipient.value).replace('ethereum:','');
                    console.log(recipient);
                    const amount = window.web3.utils.toWei(
                      this.amount.value,
                      "Ether"
                    );
                    this.transfer(recipient, amount);
                  }}
                >
                  <div id="reader"></div>
                  <h1>{this.state.balance} Coupons</h1>
                  <div id="bodyForm">
                    <div id="inputForm" width="700" >
                      <div className="form-group mr-sm-2 address">
                        <input
                          id="recipient"
                          type="text"
                          ref={(input) => {
                            this.recipient = input;
                          }}
                          className="form-control"
                          placeholder="Địa chỉ nhận"
                          required
                        />
                        <i
                          className="fa fa-camera"
                          onClick={() => {
                            this.openCamera();
                            this.setState({ closeQR: true });
                          }}
                        ></i>
                      </div>
                      <div className="form-group mr-sm-2">
                        <input
                          id="amount"
                          type="text"
                          ref={(input) => {
                            this.amount = input;
                          }}
                          className="form-control"
                          placeholder="Số coupon"
                          required
                        />
                      </div>
                    </div>
                    <div id="submitForm">

                      <button type="submit" className="btn btn-primary btn-block">
                        Gửi
                      </button>
                    </div>
                  </div>

                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Người nhận</th>
                      <th scope="col">Số Coupon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key}>
                          <td>{tx.returnValues.to}</td>
                          <td>
                            {window.web3.utils.fromWei(
                              tx.returnValues.value.toString(),
                              "Ether"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
          <div className="fl-left" id="my-qr-page">
            <button
              className="btn btn-secondary my-qr back"
              onClick={() => {
                this.closeQR();
              }}
            >
              Back
            </button>
            <div className="qr-wrapper">
              <div id="id_qrcode"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
