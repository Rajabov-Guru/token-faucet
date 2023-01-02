import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1672667926984 implements MigrationInterface {
    name = 'newMigration1672667926984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`balance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tokens\` int NOT NULL DEFAULT '0', \`satoshi\` int NOT NULL DEFAULT '0', \`experience\` int NOT NULL DEFAULT '0', \`energy\` int NOT NULL DEFAULT '0', \`clicks\` int NOT NULL DEFAULT '0', \`userId\` int NULL, UNIQUE INDEX \`REL_9297a70b26dc787156fa49de26\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`handfaucet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` int NOT NULL DEFAULT '1', \`timerStart\` datetime NULL, \`timerAmount\` int NOT NULL DEFAULT '1', \`clicks\` int NOT NULL DEFAULT '0', \`tokens\` int NOT NULL DEFAULT '0', \`energy\` int NOT NULL DEFAULT '0', \`vip\` tinyint NOT NULL DEFAULT 0, \`vipActivatedTime\` int NOT NULL DEFAULT '0', \`vipStart\` datetime NULL, \`vipRemoveDayStart\` datetime NULL, \`vipDays\` int NOT NULL DEFAULT '0', \`userId\` int NULL, UNIQUE INDEX \`REL_37c3ebac731167798c7924a61f\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`autofaucet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` int NOT NULL DEFAULT '1', \`spentTime\` int NOT NULL DEFAULT '0', \`timeBalance\` int NOT NULL DEFAULT '0', \`timerStart\` datetime NULL, \`timerAmount\` int NOT NULL DEFAULT '1', \`rewardCount\` int NOT NULL DEFAULT '0', \`clicks\` int NOT NULL DEFAULT '0', \`satoshi\` int NOT NULL DEFAULT '0', \`activated\` tinyint NOT NULL DEFAULT 0, \`activatedTime\` int NOT NULL DEFAULT '0', \`activatedStart\` datetime NULL, \`subscription\` tinyint NOT NULL DEFAULT 0, \`subscriptionMonth\` int NOT NULL DEFAULT '0', \`subscriptionStart\` datetime NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_010be53db92d8f29ad3d834482\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`login\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`secret\` int NOT NULL, \`rating\` int NOT NULL DEFAULT '10', \`isReferal\` tinyint NOT NULL DEFAULT 0, \`isLoyal\` tinyint NOT NULL DEFAULT 0, \`level\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`refererId\` int NULL, UNIQUE INDEX \`IDX_a62473490b3e4578fd683235c5\` (\`login\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`refresh\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_94f168faad896c0786646fa3d4\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`balance\` ADD CONSTRAINT \`FK_9297a70b26dc787156fa49de26b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` ADD CONSTRAINT \`FK_37c3ebac731167798c7924a61f2\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`autofaucet\` ADD CONSTRAINT \`FK_010be53db92d8f29ad3d834482d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_84c12626778431b3d99749469a8\` FOREIGN KEY (\`refererId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_94f168faad896c0786646fa3d4a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_94f168faad896c0786646fa3d4a\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_84c12626778431b3d99749469a8\``);
        await queryRunner.query(`ALTER TABLE \`autofaucet\` DROP FOREIGN KEY \`FK_010be53db92d8f29ad3d834482d\``);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` DROP FOREIGN KEY \`FK_37c3ebac731167798c7924a61f2\``);
        await queryRunner.query(`ALTER TABLE \`balance\` DROP FOREIGN KEY \`FK_9297a70b26dc787156fa49de26b\``);
        await queryRunner.query(`DROP INDEX \`REL_94f168faad896c0786646fa3d4\` ON \`token\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a62473490b3e4578fd683235c5\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_010be53db92d8f29ad3d834482\` ON \`autofaucet\``);
        await queryRunner.query(`DROP TABLE \`autofaucet\``);
        await queryRunner.query(`DROP INDEX \`REL_37c3ebac731167798c7924a61f\` ON \`handfaucet\``);
        await queryRunner.query(`DROP TABLE \`handfaucet\``);
        await queryRunner.query(`DROP INDEX \`REL_9297a70b26dc787156fa49de26\` ON \`balance\``);
        await queryRunner.query(`DROP TABLE \`balance\``);
    }

}
