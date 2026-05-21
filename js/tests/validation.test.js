import { ValidationService }
from "../services/ValidationService.js";

function assert(condition, message) {

  if (!condition) {
    throw new Error(message);
  }
}

try {

  ValidationService.validateUniqueNumber(
    [{ number: 10 }],
    10
  );

} catch {

  console.log(
    "✅ Test dorsal duplicado OK"
  );
}