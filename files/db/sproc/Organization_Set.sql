DROP PROCEDURE IF EXISTS [dbo].[Organization_Set]
GO

CREATE PROCEDURE [dbo].[Organization_Set]
    @Id NVARCHAR(100),
    @Name NVARCHAR(100),
    @AiModels NVARCHAR(MAX),
    @ProjectApprovalRequired BIT
AS
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[Organization]
    WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Organization]
        SET [Name] = @Name,
            [AiModels] = @AiModels,
            [ProjectApprovalRequired] = @ProjectApprovalRequired,
            [UpdatedAt] = GETUTCDATE()
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Organization]
            (
            [Id],
            [Name],
            [AiModels],
            [ProjectApprovalRequired],
            [CreatedAt],
            [UpdatedAt]
            )
        VALUES
            (@Id, @Name, @AiModels, @ProjectApprovalRequired, GETUTCDATE(), GETUTCDATE())
    END
END
GO