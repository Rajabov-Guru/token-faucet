import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1672692494478 implements MigrationInterface {
    name = 'newMigration1672692494478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`balance\` DROP COLUMN \`tokens\``);
        await queryRunner.query(`ALTER TABLE \`balance\` ADD \`tokens\` double NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`balance\` DROP COLUMN \`satoshi\``);
        await queryRunner.query(`ALTER TABLE \`balance\` ADD \`satoshi\` double NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`autofaucet\` DROP COLUMN \`satoshi\``);
        await queryRunner.query(`ALTER TABLE \`autofaucet\` ADD \`satoshi\` double NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` DROP COLUMN \`tokens\``);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` ADD \`tokens\` double NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`handfaucet\` DROP COLUMN \`tokens\``);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` ADD \`tokens\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`autofaucet\` DROP COLUMN \`satoshi\``);
        await queryRunner.query(`ALTER TABLE \`autofaucet\` ADD \`satoshi\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`balance\` DROP COLUMN \`satoshi\``);
        await queryRunner.query(`ALTER TABLE \`balance\` ADD \`satoshi\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`balance\` DROP COLUMN \`tokens\``);
        await queryRunner.query(`ALTER TABLE \`balance\` ADD \`tokens\` int NOT NULL DEFAULT '0'`);
    }

}
