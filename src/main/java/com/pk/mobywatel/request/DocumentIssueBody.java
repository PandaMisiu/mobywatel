package com.pk.mobywatel.request;

import com.pk.mobywatel.util.LicenseCategory;
import com.pk.mobywatel.util.RequestedDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record DocumentIssueBody(RequestedDocument requestedDocument,
                                String citizenship,
                                List<LicenseCategory> licenseCategory) {
}
