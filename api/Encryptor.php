<?php

final class Encryptor
{
    private const ENCRYPTION_METHOD = 'AES-256-CBC';

    public static function encryptJsonToBase64(string $data, string $key): string
    {
        // Generate a random Initialization Vector (IV)
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(static::ENCRYPTION_METHOD));

        // Encrypt the data using AES-256-CBC and the provided key and IV
        $encryptedData = openssl_encrypt($data, static::ENCRYPTION_METHOD, $key, OPENSSL_RAW_DATA, $iv);

        // Combine IV and ciphertext, then base64 encode the result
        return base64_encode($iv . $encryptedData);
    }

    public static function decryptBase64ToJson(string $data, string $key): mixed
    {
        // Decode the base64 string
        $decodedData = base64_decode($data);

        // Extract the IV from the decoded data
        $ivLength = openssl_cipher_iv_length(static::ENCRYPTION_METHOD);
        $iv = substr($decodedData, 0, $ivLength);

        // Attempt to decrypt the data using AES-256-CBC and the provided key and IV
        $decrypted = openssl_decrypt(substr($decodedData, $ivLength), static::ENCRYPTION_METHOD, $key, OPENSSL_RAW_DATA, $iv);

        // Check if decryption was successful
        if (false === $decrypted) {
            return ''; // Return an empty string if decryption fails
        }
        return $decrypted;
    }
}
