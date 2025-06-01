package com.pk.mobywatel.request;

import com.pk.mobywatel.util.LicenseCategory;
import com.pk.mobywatel.util.RequestedDocument;

import java.util.List;

public record DocumentIssueBody(Integer citizenID,
                                RequestedDocument requestedDocument,
                                String photoURl,
                                String citizenship,
                                List<LicenseCategory> licenseCategory) {
}
