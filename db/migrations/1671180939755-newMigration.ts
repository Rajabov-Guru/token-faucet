import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1671180939755 implements MigrationInterface {
    name = 'newMigration1671180939755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`handfaucet\` CHANGE \`level\` \`level\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`handfaucet\` CHANGE \`level\` \`level\` int NOT NULL DEFAULT '0'`);
    }

}
