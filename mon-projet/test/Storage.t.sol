import "forge-std/Test.sol";

contract StorageTest is Test {
    Storage public store;

    function setUp() public {
        store = new Storage();
    }

    function test_StockerValeur() public {
        store.stocker(42);
        assertEq(store.lire(), 42);
    }

    function testFuzz_Stocker(uint256 val) public {
        store.stocker(val);
        assertEq(store.lire(), val);
    }
}