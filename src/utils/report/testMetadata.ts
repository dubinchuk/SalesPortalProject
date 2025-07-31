import test from '@playwright/test';
import { Severity } from 'allure-js-commons';
import { allure } from 'allure-playwright';

let metadataIsSet = false;

export function setMetadata(severity: Severity, description?: string) {
  metadataIsSet = true;
  allure.severity(severity);
  if (description) allure.description(description);
}

export function resetMetadataFlag() {
  metadataIsSet = false;
}

export function checkMetadataIsSet() {
  if (test.info().status !== 'failed' && !metadataIsSet) {
    throw new Error('Requiered test metadata is not set! Add setMetadata() inside the test.');
  }
}
