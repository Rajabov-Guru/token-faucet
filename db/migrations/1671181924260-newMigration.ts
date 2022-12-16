import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1671181924260 implements MigrationInterface {
    name = 'newMigration1671181924260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`handfaucet\` CHANGE \`timerAmount\` \`timerAmount\` int NOT NULL DEFAULT '60'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`handfaucet\` CHANGE \`timerAmount\` \`timerAmount\` int NOT NULL`);
    }

}
