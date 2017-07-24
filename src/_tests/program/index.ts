import * as assert from 'assert';
import * as path from 'path';
import * as errors from '../../errors';
import * as program from '../../program';
import * as types from '../../types';

const exampleProjectPath = path.join(__dirname, 'examples/project1');

describe('Program:', () => {
  it('should validate the config file', () => {
    const configFile = path.join(exampleProjectPath, 'conf.json');

    assert.doesNotThrow(() => {
      program.run(exampleProjectPath, configFile);
    });
  });

  it('should throw if config json path does not exist', () => {
    const configFile = 'thisdoesnotexist';

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err.message.includes('no such file or directory, open \'thisdoesnotexist\'')
    );
  });

  it('should throw if syntax error in JSON', () => {
    const configFile = path.join(exampleProjectPath, 'conf1.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.JsonParseError
    );
  });

  it('should throw if JSON with invalid schema', () => {
    const configFile = path.join(exampleProjectPath, 'conf2.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.ConfigJsonValidateError
    );
  });

  it('should throw because of invalid file', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project2');
    const configFile = path.join(exampleProjectPath, 'conf.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.ValidatorInvalidPathError
    );
  });

  it('should validate because of the option ignoreFiles', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project2');
    const configFile = path.join(exampleProjectPath, 'conf.json');
    const configFile2 = path.join(exampleProjectPath, 'conf2.json');

    assert.doesNotThrow(() => {
      program.run(exampleProjectPath, configFile, { ignoreFilesGlob: 'file1.jpg' });
      program.run(exampleProjectPath, configFile, { ignoreFilesGlob: '{file1.jpg,file2.jpg}' });
      program.run(exampleProjectPath, configFile2);
    });
  });

  it('should throw because of invalid dir', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.ValidatorInvalidPathError
    );
  });

  it('should throw because of invalid dirs', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.ValidatorInvalidPathError
    );
  });

  it('should validate because of the option ignoreDirs', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf.json');
    const configFile2 = path.join(exampleProjectPath, 'conf2.json');

    assert.doesNotThrow(() => {
      program.run(exampleProjectPath, configFile, { ignoreDirsGlob: 'dir1' });
      program.run(exampleProjectPath, configFile, { ignoreDirsGlob: '{dir1,dir2}' });
      program.run(exampleProjectPath, configFile2);
    });
  });

  it('should validate conf3.json in project3 because of common rule', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf3.json');

    assert.doesNotThrow(() => {
      program.run(exampleProjectPath, configFile);
    });
  });

  it('should throw because common rule in conf4.json in project3 not enough', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf4.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.ValidatorRuleError
    );
  });

  it('should validate because config file validates everything', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf5.json');

    assert.doesNotThrow(() => {
      program.run(exampleProjectPath, configFile);
    });
  });

  it('should throw if common rule not found', () => {
    const exampleProjectPath = path.join(__dirname, 'examples/project3');
    const configFile = path.join(exampleProjectPath, 'conf6.json');

    assert.throws(
      () => { program.run(exampleProjectPath, configFile); },
      (err: Error) => err instanceof errors.ConfigJsonValidateError
    );
  });
});
