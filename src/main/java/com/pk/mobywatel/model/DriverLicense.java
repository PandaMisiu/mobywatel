package com.pk.mobywatel.model;

import com.pk.mobywatel.util.LicenseCategory;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class DriverLicense extends Document {
    @ElementCollection(targetClass = LicenseCategory.class)
    @CollectionTable(
            name = "driver_license_categories",
            joinColumns = @JoinColumn(name = "driver_license_id")
    )
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private List<LicenseCategory> categories = new ArrayList<>();
}
