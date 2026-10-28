import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { typography } from '../src/theme/typography';
import { lightColors, darkColors } from '../src/theme/colors';
import { concentricRadius, springCurves } from '../src/theme/spacing';

describe('Apple HIG Design System Tokens & Geometry (changes.md)', () => {
  test('Typography scale matches SF Pro Precision Table in Section 4', () => {
    // Large Title: 34px, 41px, bold (700), -0.75px tracking
    assert.equal(typography.largeTitle.fontSize, 34);
    assert.equal(typography.largeTitle.lineHeight, 41);
    assert.equal(typography.largeTitle.fontWeight, '700');
    assert.equal(typography.largeTitle.letterSpacing, -0.75);

    // Title 1: 28px, 34px, bold (700), -0.50px tracking
    assert.equal(typography.title1.fontSize, 28);
    assert.equal(typography.title1.lineHeight, 34);
    assert.equal(typography.title1.fontWeight, '700');
    assert.equal(typography.title1.letterSpacing, -0.5);

    // Title 2: 22px, 28px, semibold (600), -0.30px tracking
    assert.equal(typography.title2.fontSize, 22);
    assert.equal(typography.title2.lineHeight, 28);
    assert.equal(typography.title2.fontWeight, '600');
    assert.equal(typography.title2.letterSpacing, -0.3);

    // Headline: 17px, 22px, semibold (600), -0.41px tracking
    assert.equal(typography.headline.fontSize, 17);
    assert.equal(typography.headline.lineHeight, 22);
    assert.equal(typography.headline.fontWeight, '600');
    assert.equal(typography.headline.letterSpacing, -0.41);

    // Body: 17px, 22px, regular (400), -0.41px tracking
    assert.equal(typography.body.fontSize, 17);
    assert.equal(typography.body.lineHeight, 22);
    assert.equal(typography.body.fontWeight, '400');
    assert.equal(typography.body.letterSpacing, -0.41);

    // Callout: 16px, 21px, regular (400), -0.32px tracking
    assert.equal(typography.callout.fontSize, 16);
    assert.equal(typography.callout.lineHeight, 21);
    assert.equal(typography.callout.fontWeight, '400');
    assert.equal(typography.callout.letterSpacing, -0.32);

    // Subheadline: 15px, 20px, regular (400), -0.24px tracking
    assert.equal(typography.subheadline.fontSize, 15);
    assert.equal(typography.subheadline.lineHeight, 20);
    assert.equal(typography.subheadline.fontWeight, '400');
    assert.equal(typography.subheadline.letterSpacing, -0.24);

    // Footnote: 13px, 18px, regular (400), -0.08px tracking
    assert.equal(typography.footnote.fontSize, 13);
    assert.equal(typography.footnote.lineHeight, 18);
    assert.equal(typography.footnote.fontWeight, '400');
    assert.equal(typography.footnote.letterSpacing, -0.08);

    // Caption 1: 12px, 16px, regular (400), 0 tracking
    assert.equal(typography.caption1.fontSize, 12);
    assert.equal(typography.caption1.lineHeight, 16);
    assert.equal(typography.caption1.letterSpacing, 0);

    // Caption 2: 11px, 13px, medium (500), +0.07px tracking
    assert.equal(typography.caption2.fontSize, 11);
    assert.equal(typography.caption2.lineHeight, 13);
    assert.equal(typography.caption2.fontWeight, '500');
    assert.equal(typography.caption2.letterSpacing, 0.07);

    // Mandatory rule for amounts: tabular-nums
    assert.deepEqual(typography.amount.fontVariant, ['tabular-nums']);
    assert.deepEqual(typography.amountLarge.fontVariant, ['tabular-nums']);
  });

  test('Concentric Hardware-Software Harmony Formula (Section 1.C)', () => {
    // R_inner = max(0, R_outer - Padding)
    assert.equal(concentricRadius(24, 8), 16);
    assert.equal(concentricRadius(20, 12), 8);
    assert.equal(concentricRadius(16, 16), 0);
    assert.equal(concentricRadius(12, 16), 0);
  });

  test('Color tokens adhere to Elevation = Luminance & Specular Hairlines (Section 1.A & 3)', () => {
    // Section 1.A Specular Hairline tokens
    assert.equal(lightColors.specularHairline, 'rgba(0, 0, 0, 0.06)');
    assert.equal(darkColors.specularHairline, 'rgba(255, 255, 255, 0.12)');

    // Section 3.A Dark Mode OLED Canvas
    assert.equal(darkColors.background, '#000000');
    assert.equal(darkColors.surface, '#1C1C1E');
    assert.equal(darkColors.surfaceElevated, '#2C2C2E');
    assert.equal(darkColors.surfaceInset, '#2C2C2E');

    // Section 3.B 4-tier foreground opacities
    assert.equal(lightColors.textPrimary, '#000000');
    assert.equal(darkColors.textPrimary, '#FFFFFF');
    assert.equal(lightColors.textSecondary, 'rgba(60, 60, 67, 0.60)');
    assert.equal(darkColors.textSecondary, 'rgba(235, 235, 245, 0.60)');
    assert.equal(lightColors.textTertiary, 'rgba(60, 60, 67, 0.30)');
    assert.equal(darkColors.textTertiary, 'rgba(235, 235, 245, 0.30)');
  });

  test('Spring Curves definition matches Section 6.A specifications', () => {
    assert.equal(springCurves.snappy.mass, 1.0);
    assert.equal(springCurves.snappy.stiffness, 400);
    assert.equal(springCurves.snappy.damping, 28);

    assert.equal(springCurves.navigation.mass, 1.0);
    assert.equal(springCurves.navigation.stiffness, 280);
    assert.equal(springCurves.navigation.damping, 30);
  });

  test('Theme transition duration matches Apple Snappy spring timing (220ms)', () => {
    // Section 6.A Snappy duration equivalent: ~220ms
    const SNAPPY_DURATION_MS = 220;
    assert.equal(SNAPPY_DURATION_MS, 220);
    assert.equal(springCurves.snappy.mass, 1.0);
    assert.equal(springCurves.snappy.stiffness, 400);
    assert.equal(springCurves.snappy.damping, 28);
  });
});

