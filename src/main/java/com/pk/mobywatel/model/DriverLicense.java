package com.pk.mobywatel.model;

import com.pk.mobywatel.util.LicenseCategory;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class DriverLicense extends Document {

    @ElementCollection(targetClass = LicenseCategory.class)
    @CollectionTable(
            name = "driver_license_categories",
            joinColumns = @JoinColumn(name = "driver_license_id")
    )
    @Enumerated(EnumType.STRING)
    private List<LicenseCategory> categories = new ArrayList<>();
}
