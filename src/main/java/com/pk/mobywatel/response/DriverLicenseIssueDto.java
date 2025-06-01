package com.pk.mobywatel.response;

import com.pk.mobywatel.util.LicenseCategory;
import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Data
public class DriverLicenseIssueDto extends DocumentIssueRequestDto {
    private List<LicenseCategory> categories;
}
