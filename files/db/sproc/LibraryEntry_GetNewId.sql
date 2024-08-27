DROP PROCEDURE IF EXISTS [dbo].[LibraryEntry_GetNewId]
GO

CREATE PROCEDURE [dbo].[LibraryEntry_GetNewId]
    @Id VARCHAR(10) OUTPUT
AS
BEGIN
    DECLARE @Min INT = 10000
    DECLARE @Max INT = 999999
    
    SET @Id = 'L-' + RIGHT('0000' + CAST(FLOOR(RAND() * (@Max - @Min) + @Min) AS VARCHAR(10)), 6)

    WHILE EXISTS (SELECT 1 FROM [dbo].[LibraryEntries] WHERE [Id] = @Id)
    BEGIN
        SET @Id = 'L-' + RIGHT('0000' + CAST(FLOOR(RAND() * (@Max - @Min) + @Min) AS VARCHAR(10)), 6)
    END
END
GO
