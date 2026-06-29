const validateCreateStudent = (req, res, next) => {
  const { name, rollNo, class: studentClass, age, gender, contact } = req.body;
  const errors = [];

  if (!name || typeof name !== "string") errors.push("Name is required and must be a string");
  if (!rollNo || typeof rollNo !== "number") errors.push("Roll number is required and must be a number");
  if (!studentClass || typeof studentClass !== "string") errors.push("Class is required and must be a string");

  if (age && (typeof age !== "number" || age < 3 || age > 25)) errors.push("Age must be a number between 3 and 25");
  if (gender && !["male", "female", "other"].includes(gender)) errors.push("Gender must be male, female, or other");
  if (contact && !/^[0-9]+$/.test(contact)) errors.push("Contact must contain digits only");

  if (errors.length > 0) {
    return next({ error: errors });
  }

  next();
};

export default validateCreateStudent;