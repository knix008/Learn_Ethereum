// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Pausable.sol";
import "./Whitelist.sol";

/**
 *Interface for ERC20
 */
interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    event TransferEvt(address indexed from, address indexed to, uint256 value);

    event ApprovalEvt(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract MyERC20Tokens is ERC20, Whitelist, Pausable {
    TokenSummary public tokenSummary;
    mapping(address => uint256) internal balances;
    mapping(address => mapping(address => uint256)) internal allowed;
    uint256 private _totalSupply;
    uint8 public constant SUCCESS_CODE = 0;
    string public constant SUCCESS_MESSAGE = "SUCCESS";
    uint8 public constant NON_WHITELIST_CODE = 1;
    string public constant NON_WHITELIST_ERROR =
        "ILLEGAL_TRANSFER_TO_NON_WHITELISTED_ADDRESS";
    event BurnEvt(address from, uint256 value);

    struct TokenSummary {
        address initialAccount;
        string name;
        string symbol;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _initialAccount,
        uint256 _initialBalance
    ) public {
        addWhitelist(_initialAccount);
        balances[_initialAccount] = _initialBalance;
        _totalSupply = _initialBalance;
        tokenSummary = TokenSummary(_initialAccount, _name, _symbol);
    }

    modifier verify(
        address from,
        address to,
        uint256 value
    ) {
        uint8 restrictionCode = validateTransferRestricted(to);
        require(
            restrictionCode == SUCCESS_CODE,
            messageHandler(restrictionCode)
        );
        _;
    }

    function validateTransferRestricted(
        address to
    ) public view returns (uint8 restrictionCode) {
        if (!isWhitelist(to)) {
            restrictionCode = NON_WHITELIST_CODE;
        } else {
            restrictionCode = SUCCESS_CODE;
        }
    }

    function messageHandler(
        uint8 restrictionCode
    ) public pure returns (string memory message) {
        if (restrictionCode == SUCCESS_CODE) {
            message = SUCCESS_MESSAGE;
        } else if (restrictionCode == NON_WHITELIST_CODE) {
            message = NON_WHITELIST_ERROR;
        }
    }

    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(
        address account
    ) external view virtual override returns (uint256) {
        return balances[account];
    }

    function transfer(
        address to,
        uint256 value
    )
        external
        override
        verify(msg.sender, to, value)
        whenNotPaused
        returns (bool success)
    {
        require(to != address(0) && balances[msg.sender] > value);
        balances[msg.sender] = balances[msg.sender] - value;
        balances[to] = balances[to] + value;
        emit TransferEvt(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address spender,
        uint256 value
    )
        external
        virtual
        override
        verify(from, spender, value)
        whenNotPaused
        returns (bool)
    {
        require(
            spender != address(0) &&
                value <= balances[from] &&
                value <= allowed[from][msg.sender]
        );
        balances[from] = balances[from] - value;
        balances[spender] = balances[spender] + value;
        allowed[from][msg.sender] = allowed[from][msg.sender] - value;
        emit TransferEvt(from, spender, value);
        return true;
    }

    function allowance(
        address ownerAddress,
        address spender
    ) external view virtual override returns (uint256) {
        return allowed[ownerAddress][spender];
    }

    function approve(
        address spender,
        uint256 value
    ) external virtual override returns (bool) {
        require(spender != address(0));
        allowed[msg.sender][spender] = value;
        emit ApprovalEvt(msg.sender, spender, value);
        return true;
    }

    function burn(
        uint256 value
    ) external whenNotPaused onlyAdmin returns (bool success) {
        require(balances[msg.sender] >= value);
        balances[msg.sender] -= value;
        _totalSupply -= value;
        emit BurnEvt(msg.sender, value);
        return true;
    }

    function mint(
        address account,
        uint256 value
    ) external whenNotPaused onlyAdmin returns (bool) {
        require(account != address(0));
        _totalSupply = _totalSupply += value;
        balances[account] = balances[account] + value;
        emit TransferEvt(address(0), account, value);
        return true;
    }
}
