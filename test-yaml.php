<?php
/**
 * test-yaml.php
 *
 * @package default
 */


declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once 'functions.php';

final class EmailTest extends TestCase
{

  /**
   *
   */
  public function testCanBeCreatedFromValidEmailAddress(): void
  {
    var_dump(readYaml("data/strings.yml#strings/labels"));

  }


}
