const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Proxy", function () {
  let thing, proxy, proxyAsThing;
  before(async () => {
    const Thing = await ethers.getContractFactory("Thing");
    thing = await Thing.deploy();
    await thing.deployed();

    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy(thing.address);
    await proxy.deployed();

    proxyAsThing = await ethers.getContractAt("Thing", proxy.address);
  });

  it("should store a number with the value 100", async function () {
    const actual = await proxyAsThing.num();
    assert.equal(actual.toString(), "100");
  });

  describe("we change the number", () => {
    before(async () => {
      await proxyAsThing.action(200);
    });

    it("should have changed num to 200", async () => {
      const actual = await proxyAsThing.num();
      assert.equal(actual.toString(), "200");
    });

    describe("we deploy a thingV2, and point the proxy at it", () => {
      let thingv2;
      before(async () => {
        const ThingV2 = await ethers.getContractFactory("ThingV2");
        thingv2 = await ThingV2.deploy();
        await thingv2.deployed();

        await proxy.changeAddress(thingv2.address);
      });

      it("should retain the initial 200 value", async () => {
        const actual = await proxyAsThing.num();
        assert.equal(actual.toString(), "200");
      });

      describe("going to modify the value with the new action", () => {
        before(async () => {
          await proxyAsThing.action(100);
        });

        it("should set 5000 inside of thing v2", async () => {
          const actual = await proxyAsThing.num();
          assert.equal(actual.toString(), "5000");
        });
      });
    });
  });
});
