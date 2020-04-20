import massive.munit.TestSuite;

import storygen.TokenTest;
import storygen.GeneratorTest;
import storygen.TransformsTest;

/**
 * Auto generated Test Suite for MassiveUnit.
 * Refer to munit command line tool for more information (haxelib run munit)
 */
class TestSuite extends massive.munit.TestSuite
{
	public function new()
	{
		super();

		add(storygen.TokenTest);
		add(storygen.GeneratorTest);
		add(storygen.TransformsTest);
	}
}
