package com.pk.mobywatel.response;

import com.pk.mobywatel.util.LicenseCategory;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Getter
@Setter
public class DriverLicenseIssueDto extends DocumentIssueRequestDto {
    private List<LicenseCategory> categories;
}
