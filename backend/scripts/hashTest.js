import bcrypt from "bcryptjs";

const plainPassword = "adminpassword";

bcrypt.hash(plainPassword, 10).then((newHash) => {
  console.log("New Hash:", newHash);
});
