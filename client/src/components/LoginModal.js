import React from 'react'
import { connect } from 'react-redux'
import * as uiActions from 'actions/ui'
import { bindActionCreators } from 'redux'
import Modal from 'components/Modal'
import { getClnToken } from 'selectors/basicToken'

import ClnIcon from 'images/cln.png'
import LockIcon from 'images/lock.png'
import MetamaskIcon from 'images/metamask.png'
import ReactGA from 'services/ga'

class LoginModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finishInstall: false
    }
  }

  onClose = () => {
    this.props.uiActions.hideModal()
    if (this.state.finishInstall) {
      ReactGA.event({
        category: 'Metamask',
        action: 'Close',
        label: 'Finish Metamask Install'
      })
    }
    else if (!this.props.web3.isAccountUnlocked) {
      ReactGA.event({
        category: 'Metamask',
        action: 'Close',
        label: 'Metamask locked'
      })
    } else if (!this.props.web3.isMetaMask) {
      ReactGA.event({
        category: 'Metamask',
        action: 'Close',
        label: 'Install Metamask'
      })
    }
  }

  finishInstalling = () => {
    ReactGA.event({
      category: 'Metamask',
      action: 'Click',
      label: 'Finish Metamask Install'
    })
    window.location.reload(false)
  }

  finishUnlocking = () => {
    ReactGA.event({
      category: 'Metamask',
      action: 'Click',
      label: 'Metamask locked'
    })
    window.location.reload(false)
  }

  installMetamask = () => {
    this.setState({
      finishInstall: true
    })
    ReactGA.event({
      category: 'Metamask',
      action: 'Click',
      label: 'Install Metamask'
    })
    window.open('https://metamask.io/', '_blank')
  }

  render() {
    let modalContent
    if (this.state.finishInstall) {
      ReactGA.event({
        category: 'Metamask',
        action: 'View',
        label: 'Finish Metamask Install'
      })
      modalContent = <div className="modal-content-wrapper">
            <img src={MetamaskIcon}/>
            <h4>Finish installing MetaMask  to continue</h4>
            <p>Make sure you follow the instruction on MetaMask to finish the installation.</p>
            <div className="button" onClick={this.finishInstalling}>I INSTALLED METAMASK</div>
          </div>
    } else if (!this.props.web3.isMetaMask) {
      ReactGA.event({
        category: 'Metamask',
        action: 'View',
        label: 'Install Metamask'
      })
      modalContent = <div className="modal-content-wrapper">
            <div className="images flex center"><img src={ClnIcon}/><span>+</span><img src={MetamaskIcon}/></div>
            <h4>Want to connect?</h4>
            <p>You’ll need a safe place to store your coins, in order to do that you need to download the MetaMask wallet. The wallet will also act as your login to the dashboard.</p>
            <div className="button" onClick={this.installMetamask}>INSTALL METAMASK</div>
          </div>
    } else if (!this.props.web3.isAccountUnlocked) {
      ReactGA.event({
        category: 'Metamask',
        action: 'View',
        label: 'Metamask locked'
      })
      modalContent = <div className="modal-content-wrapper">
            <img className="lock-icon" src={LockIcon}/>
            <h4>Your MetaMask is locked</h4>
            <p>Please unlock your MetaMask extension in order to use the dashboard.</p>
            <div className="button" onClick={this.finishUnlocking}>I'VE UNLOCKED METAMASK</div>
          </div>
    }

    return (
      <Modal onClose={this.onClose}>
        {modalContent}
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    web3: state.web3
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)
