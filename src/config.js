import cosmiconfig from 'cosmiconfig';

const configSearch = cosmiconfig('discoptero').searchSync();

if (configSearch === null) {
  throw new Error(
    'Did not find a config file for module name "discoptero" - see https://github.com/davidtheclark/cosmiconfig#explorersearch'
  );
}

export default configSearch.config;
