package com.annasaheb.aitaskmanager.security.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Component;

@Component
public class BlockchainUtil {

	public String generateHash(String data) {
		try {
			//MessageDigest is a class that provides the 
//			functionality of a message digest algorithm, such as SHA-256.
//			A message digest is a cryptographic hash function that takes an input (or 'message') and returns a fixed-size string of bytes. 
//			The output is typically a 'digest' that is unique to each unique input.
			MessageDigest digest = MessageDigest.getInstance("SHA-256");

			//convert the input data to bytes and compute the hash
			byte[] hash = digest.digest(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));

			StringBuilder hexString = new StringBuilder();

			for (byte b : hash) {
				// %02x means format the byte as a two-digit hexadecimal number,
//				padding with a leading zero if necessary
				hexString.append(String.format("%02x", b));
			}
			return hexString.toString();
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}

	}

}
