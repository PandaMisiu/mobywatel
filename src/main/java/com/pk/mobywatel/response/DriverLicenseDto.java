package com.pk.mobywatel.response;

import com.pk.mobywatel.util.LicenseCategory;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DriverLicenseDto extends DocumentDto {
    private List<LicenseCategory> categories;
}
