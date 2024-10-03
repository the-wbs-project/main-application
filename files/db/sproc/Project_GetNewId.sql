DROP PROCEDURE IF EXISTS [dbo].[Project_GetNewId]
GO

CREATE PROCEDURE [dbo].[Project_GetNewId]
    @Id VARCHAR(10) OUTPUT
AS
BEGIN
    DECLARE @Min INT = 10000
    DECLARE @Max INT = 999999

    SET @Id = 'P-' + RIGHT('0000' + CAST(FLOOR(RAND() * (@Max - @Min) + @Min) AS VARCHAR(10)), 6)

    WHILE EXISTS (SELECT 1
    FROM [dbo].[Projects]
    WHERE [Id] = @Id)
    BEGIN
        SET @Id = 'P-' + RIGHT('0000' + CAST(FLOOR(RAND() * (@Max - @Min) + @Min) AS VARCHAR(10)), 6)
    END
END
GO
