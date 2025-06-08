package com.pk.mobywatel.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EncryptionConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String plain) {
        return plain == null ? null : AESUtil.encrypt(plain);
    }

    @Override
    public String convertToEntityAttribute(String encrypted) {
        return encrypted == null ? null : AESUtil.decrypt(encrypted);
    }
}
