const bcrypt = require('bcrypt');

const hash = "$2b$10$iv3O.PV8Vw0dt0H23A55IewLdNq26p4CNPMGReM31qicVeKPlDqu6";

(async () => {
    console.log(await bcrypt.compare("abcd1234", hash));
})();