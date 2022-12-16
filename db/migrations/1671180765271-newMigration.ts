import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1671180765271 implements MigrationInterface {
    name = 'newMigration1671180765271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`handfaucet\` ADD \`level\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` ADD \`timerAmount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_a62473490b3e4578fd683235c5\` (\`login\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_a62473490b3e4578fd683235c5\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` DROP COLUMN \`timerAmount\``);
        await queryRunner.query(`ALTER TABLE \`handfaucet\` DROP COLUMN \`level\``);
    }

}
