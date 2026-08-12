export const PM_CONTOURS   = ['dev','ift','psi','rdt','prom'];
export const PM_ENV_LABELS = { dev: 'DEV', ift: 'IFT', psi: 'PSI', rdt: 'RDT', prom: 'PROM' };
export const PM_ENV_COLORS = { dev: 'env-dev', ift: 'env-ift', psi: 'env-psi', rdt: 'env-rdt', prom: 'env-prom' };

export const WS_ROLES = {
    admin:     { label: 'Администратор', cls: 'admin' },
    developer: { label: 'Разработчик',   cls: 'developer' },
    analyst:   { label: 'Аналитик',      cls: 'analyst' },
};

export const FRAMEWORK_DEFAULTS = [
    { key: 'b2c.sql.conf.path',              value: 'hdfs:///oozie-app/b2/{block}/{group}/{datamart_name}/conf/external/external.conf' },
    { key: 'b2c.sql.engine.spark.cmd',        value: '${spark_submit_cmd_main} ${spark_submit_cmd_high}' },
    { key: 'b2c.sql.external.function.path',  value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/external/function' },
    { key: 'b2c.sql.external.udf.path',       value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/external/udf' },
    { key: 'b2c.sql.java.xmx',                value: '8192M' },
    { key: 'b2c.sql.log.level',               value: 'info' },
    { key: 'b2c.sql.pipelines.config.path',   value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/etl/wfs/regress_test/pipeline.json' },
    { key: 'b2c.sql.secman.conf.hdfs.path',   value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/conf/secman/secman-test-3.conf' },
    { key: 'description',                      value: '"devbalsdpganza9-b2c-sql-regress-D-01.010.13"' },
    { key: 'DEV_TEAM_EMAIL',                   value: 'AASukharnikov@sberbank.ru' },
    { key: 'DL_D',                             value: '0,999305556' },
    { key: 'mapreduce.job.queuename',          value: 'default' },
    { key: 'mapreduce.map.memory.mb',          value: '16384' },
    { key: 'migratedToOozie2',                 value: 'true' },
    { key: 'oozie.wf.application.path',        value: 'hdfs:///oozie-app/b2c/fw/b2c-sql/D-01.010.13' },
    { key: 'yarn.app.mapreduce.am.resource.mb', value: '16384' },
];
