import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1670949872239 implements MigrationInterface {
    name = 'newMigration1670949872239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bonus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`value\` int NOT NULL DEFAULT '0', \`clicks\` int NOT NULL DEFAULT '0', \`isConst\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`handfaucet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`vip\` tinyint NOT NULL DEFAULT 0, \`timerStart\` varchar(255) NULL, \`clicks\` int NOT NULL DEFAULT '0', \`tokens\` int NOT NULL DEFAULT '0', \`userId\` int NULL, UNIQUE INDEX \`REL_37c3ebac731167798c7924a61f\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`refresh\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_94f168faad896c0786646fa3d4\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`login\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`secret\` int NOT NULL, \`rating\` int NOT NULL DEFAULT '0', \`isRef\` tinyint NOT NULL DEFAULT 0, \`level\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`balance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tokens\` int NOT NULL DEFAULT '0', \`satoshi\` int NOT NULL DEFAULT '0', \`experience\` int NOT NULL DEFAULT '0', \`energy\` int NOT NULL DEFAULT '0', \`clicks\` int NOT NULL DEFAULT '0', \`userId\` int NULL, UNIQUE INDEX \`REL_9297a70b26dc787156fa49de26\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bonus_users_user\` (\`bonusId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_9264358b0f8312b09a89dc7686\` (\`bonusId\`), INDEX \`IDX_22bcd12115c36e7947efe67c3c\` (\`userId\`), PRIMARY KEY (\`bonusId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` ADD CONSTRAINT \`FK_37c3ebac731167798c7924a61f2\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_94f168faad896c0786646fa3d4a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`balance\` ADD CONSTRAINT \`FK_9297a70b26dc787156fa49de26b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bonus_users_user\` ADD CONSTRAINT \`FK_9264358b0f8312b09a89dc76864\` FOREIGN KEY (\`bonusId\`) REFERENCES \`bonus\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`bonus_users_user\` ADD CONSTRAINT \`FK_22bcd12115c36e7947efe67c3c6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bonus_users_user\` DROP FOREIGN KEY \`FK_22bcd12115c36e7947efe67c3c6\``);
        await queryRunner.query(`ALTER TABLE \`bonus_users_user\` DROP FOREIGN KEY \`FK_9264358b0f8312b09a89dc76864\``);
        await queryRunner.query(`ALTER TABLE \`balance\` DROP FOREIGN KEY \`FK_9297a70b26dc787156fa49de26b\``);
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_94f168faad896c0786646fa3d4a\``);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` DROP FOREIGN KEY \`FK_37c3ebac731167798c7924a61f2\``);
        await queryRunner.query(`DROP INDEX \`IDX_22bcd12115c36e7947efe67c3c\` ON \`bonus_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_9264358b0f8312b09a89dc7686\` ON \`bonus_users_user\``);
        await queryRunner.query(`DROP TABLE \`bonus_users_user\``);
        await queryRunner.query(`DROP INDEX \`REL_9297a70b26dc787156fa49de26\` ON \`balance\``);
        await queryRunner.query(`DROP TABLE \`balance\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_94f168faad896c0786646fa3d4\` ON \`token\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP INDEX \`REL_37c3ebac731167798c7924a61f\` ON \`handfaucet\``);
        await queryRunner.query(`DROP TABLE \`handfaucet\``);
        await queryRunner.query(`DROP TABLE \`bonus\``);
    }

}
