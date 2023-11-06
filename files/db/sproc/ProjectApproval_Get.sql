DROP PROCEDURE IF EXISTS [dbo].[ProjectApproval_Get]
GO

DROP PROCEDURE IF EXISTS [dbo].[ProjectApproval_Get]
GO

CREATE PROCEDURE [dbo].[ProjectApproval_Get]
    @ProjectId nvarchar(100)
AS
    CREATE TABLE #Ids(Id [nvarchar](100))
BEGIN
    INSERT INTO #Ids VALUES ('project-title')
    INSERT INTO #Ids VALUES ('project-description')
    INSERT INTO #Ids VALUES ('project-roles')
    INSERT INTO #Ids
        SELECT TOP (1000) [Id]
        FROM [dbo].[ProjectNodes]
        WHERE [ProjectId] = @ProjectId AND [Removed] = 0

    SELECT id.Id, ISNULL(pa.ProjectId, @ProjectId) ProjectId, pa.ApprovedOn, pa.ApprovedBy, pa.IsApproved
        FROM #Ids id LEFT JOIN [dbo].[ProjectApproval] pa ON pa.[Id] = id.ID

    DROP TABLE #Ids
END
GO
