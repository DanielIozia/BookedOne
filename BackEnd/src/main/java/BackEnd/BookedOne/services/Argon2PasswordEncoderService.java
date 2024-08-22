package BackEnd.BookedOne.services;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;
import org.springframework.stereotype.Service;

@Service
public class Argon2PasswordEncoderService {

    //si mette nelle variabili d'ambiente e non viene pushato (è la chiave di decriptazione della password)
    private String salt = "usahzyuawbf01938873.@92uehsa";

    public String hashPassword(char[] password) {
        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
            .withSalt(salt.getBytes())  
            .withIterations(2)
            .withMemoryAsKB(1024)
            .withParallelism(1);

        generator.init(builder.build());

        byte[] result = new byte[32];  
        generator.generateBytes(String.valueOf(password).getBytes(), result);
        return org.bouncycastle.util.encoders.Hex.toHexString(result);
    }

    public boolean verifyPassword(String hash, char[] password) {
        String newHash = hashPassword(password);
        return newHash.equals(hash);
    }
}
