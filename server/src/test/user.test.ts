import { User } from "../models/User.ts";

describe("User Model", () => {
  it("should create a user with valid data", async () => {
    const user = new User({
      name: "bubbles",
      email: "bubbles213@gmail.com",
      password: "plaintextPassword",
    });

    const saved_data = await user.save();

    expect(user.name).toBe("bubbles");
    expect(user.email).toMatch(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );
    expect(user.password).not.toBe("plaintextPassword");
    expect(user.password).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });

  it("should not allow duplicate emails", async () => {
    const user1 = new User({
      name: "suddentoast",
      email: "suddentoast231@gmail.com",
      password: "plainTextPassword1",
    });

    await user1.save();

    const user2 = new User({
      name: "hellblader",
      email: "suddentoast231@gmail.com",
      password: "plainTextPassword2",
    });

    await expect(user2.save()).rejects.toThrow(/duplicate key/i);
  });

  it("should hash passwords before saving", async () => {
    const user = new User({
      name: "user1",
      email: "user321@gmail.com",
      password: "plainTextPassword",
    });

    const saved_data = await user.save();

    expect(saved_data.password).not.toBe("plainTextPassword");
    expect(saved_data.password).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });
});
