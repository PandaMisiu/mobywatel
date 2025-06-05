package com.pk.mobywatel.model;

import com.pk.mobywatel.util.LicenseCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class DriverLicenseIssueRequest extends DocumentIssueRequest {
    @ElementCollection(targetClass = LicenseCategory.class)
    @CollectionTable(
            name = "driver_license_request_categories",
            joinColumns = @JoinColumn(name = "driver_license_id")
    )
    @Enumerated(EnumType.STRING)
    private List<LicenseCategory> categories = new ArrayList<>();
}
